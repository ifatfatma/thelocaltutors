<?php

namespace App\Http\Controllers\Installer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use PDO;

class InstallController extends Controller
{
    /**
     * Step 1: Server Requirements & Permissions
     */
    public function index()
    {
        if (file_exists(storage_path('installed'))) {
            return redirect('/')->with('info', 'Application is already installed.');
        }

        $phpVersion = [
            'current' => phpversion(),
            'minimum' => '8.2.0',
            'supported' => version_compare(phpversion(), '8.2.0', '>=')
        ];

        $requiredExtensions = [
            'pdo' => 'PDO',
            'pdo_mysql' => 'PDO MySQL Driver',
            'openssl' => 'OpenSSL',
            'mbstring' => 'Mbstring',
            'tokenizer' => 'Tokenizer',
            'xml' => 'XML',
            'ctype' => 'Ctype',
            'json' => 'JSON',
            'curl' => 'cURL',
            'fileinfo' => 'Fileinfo',
            'gd' => 'GD Image Processing'
        ];

        $extensions = [];
        $allExtensionsPassed = true;
        foreach ($requiredExtensions as $ext => $name) {
            $loaded = extension_loaded($ext);
            $extensions[] = [
                'name' => $name,
                'extension' => $ext,
                'status' => $loaded
            ];
            if (!$loaded) {
                $allExtensionsPassed = false;
            }
        }

        $requiredDirs = [
            'storage' => storage_path(),
            'storage/framework' => storage_path('framework'),
            'storage/logs' => storage_path('logs'),
            'bootstrap/cache' => base_path('bootstrap/cache'),
            '.env' => file_exists(base_path('.env')) ? base_path('.env') : base_path()
        ];

        $directories = [];
        $allDirsPassed = true;
        foreach ($requiredDirs as $name => $path) {
            $writable = is_writable($path);
            $directories[] = [
                'name' => $name,
                'path' => $path,
                'status' => $writable
            ];
            if (!$writable) {
                $allDirsPassed = false;
            }
        }

        $canProceed = $phpVersion['supported'] && $allExtensionsPassed && $allDirsPassed;

        return view('installer.requirements', compact(
            'phpVersion', 'extensions', 'directories', 'canProceed'
        ));
    }

    /**
     * Step 2: Database Configuration
     */
    public function database()
    {
        if (file_exists(storage_path('installed'))) {
            return redirect('/')->with('info', 'Application is already installed.');
        }

        $defaultHost = env('DB_HOST', '127.0.0.1');
        $defaultPort = env('DB_PORT', '3306');
        $defaultDatabase = env('DB_DATABASE', 'thelocaltutors');
        $defaultUsername = env('DB_USERNAME', 'root');
        $defaultPassword = env('DB_PASSWORD', '');

        return view('installer.database', compact(
            'defaultHost', 'defaultPort', 'defaultDatabase', 'defaultUsername', 'defaultPassword'
        ));
    }

    /**
     * Helper to test PDO connection and database creation with friendly diagnostics
     */
    private function testPdoConnection($host, $port, $database, $username, $password)
    {
        try {
            // First connect without database to verify host and user
            $dsnNoDb = "mysql:host={$host};port={$port};charset=utf8mb4";
            $pdo = new PDO($dsnNoDb, $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_TIMEOUT => 5
            ]);

            // Create database if not exists
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$database}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

            // Connect to database directly
            $dsnWithDb = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";
            $pdoDb = new PDO($dsnWithDb, $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_TIMEOUT => 5
            ]);

            return ['success' => true];
        } catch (\PDOException $e) {
            $msg = $e->getMessage();
            if ($e->getCode() == 1045 || str_contains($msg, '1045') || str_contains($msg, 'Access denied')) {
                if (str_contains($msg, 'using password: NO')) {
                    $friendly = "Access denied: Your MySQL server requires a password for user '{$username}'. Please enter your MySQL password in the Password field.";
                } else {
                    $friendly = "Access denied: Incorrect password for MySQL user '{$username}'. Please check your password and try again.";
                }
            } elseif ($e->getCode() == 2002 || str_contains($msg, '2002') || str_contains($msg, 'refused') || str_contains($msg, 'not found')) {
                $friendly = "Cannot connect to MySQL server at {$host}:{$port}. Please verify that your MySQL server/service is started.";
            } else {
                $friendly = "Database connection error: " . $msg;
            }

            return [
                'success' => false,
                'message' => $friendly,
                'raw_error' => $msg,
            ];
        }
    }

    /**
     * AJAX Test Database Connection
     */
    public function testDatabase(Request $request)
    {
        $request->validate([
            'host' => 'required',
            'port' => 'required|numeric',
            'database' => 'required',
            'username' => 'required'
        ]);

        $res = $this->testPdoConnection(
            $request->host,
            $request->port,
            $request->database,
            $request->username,
            $request->password ?? ''
        );

        if ($res['success']) {
            return response()->json([
                'status' => 200,
                'message' => 'Connection verified successfully! Database is ready.'
            ]);
        }

        return response()->json([
            'status' => 400,
            'message' => $res['message']
        ], 422);
    }

    /**
     * Save Database Settings to Session and Proceed
     */
    public function saveDatabase(Request $request)
    {
        $request->validate([
            'host' => 'required',
            'port' => 'required|numeric',
            'database' => 'required',
            'username' => 'required'
        ]);

        $res = $this->testPdoConnection(
            $request->host,
            $request->port,
            $request->database,
            $request->username,
            $request->password ?? ''
        );

        if (!$res['success']) {
            return redirect()->back()
                ->withInput()
                ->with('error', $res['message']);
        }

        session([
            'install_db' => [
                'host' => $request->host,
                'port' => $request->port,
                'database' => $request->database,
                'username' => $request->username,
                'password' => $request->password ?? ''
            ]
        ]);

        return redirect()->route('install.admin');
    }

    /**
     * Step 3: Application & Administrator Setup
     */
    public function admin()
    {
        if (file_exists(storage_path('installed'))) {
            return redirect('/')->with('info', 'Application is already installed.');
        }

        $dbConfig = session('install_db') ?: [
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'thelocaltutors'),
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
        ];

        // Sanity check database connection before showing admin setup
        $res = $this->testPdoConnection(
            $dbConfig['host'],
            $dbConfig['port'],
            $dbConfig['database'],
            $dbConfig['username'],
            $dbConfig['password']
        );

        // Auto-heal if a password was saved/autofilled but MySQL has no password (common XAMPP situation)
        if (!$res['success'] && !empty($dbConfig['password'])) {
            $emptyRes = $this->testPdoConnection(
                $dbConfig['host'],
                $dbConfig['port'],
                $dbConfig['database'],
                $dbConfig['username'],
                ''
            );
            if ($emptyRes['success']) {
                $dbConfig['password'] = '';
                session(['install_db' => $dbConfig]);
                $res = $emptyRes;
            }
        }

        if (!$res['success']) {
            return redirect()->route('install.database')
                ->with('error', $res['message']);
        }

        $defaultAppName = env('APP_NAME', 'The Local Tutors');
        $defaultAppUrl = request()->getSchemeAndHttpHost();

        return view('installer.admin', compact('defaultAppName', 'defaultAppUrl', 'dbConfig'));
    }

    /**
     * Step 4: Execute Installation (Migrate, Seed & Configure)
     */
    public function process(Request $request)
    {
        if (file_exists(storage_path('installed'))) {
            return redirect('/')->with('info', 'Application is already installed.');
        }

        $request->validate([
            'app_name' => 'required',
            'app_url' => 'required|url',
            'admin_name' => 'required',
            'admin_email' => 'required|email',
            'admin_username' => 'required',
            'admin_mobile' => 'required',
            'admin_password' => 'required|min:6|confirmed'
        ]);

        $dbConfig = session('install_db') ?: [
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'thelocaltutors'),
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
        ];

        // Sanity check database connection before running migrations
        $testRes = $this->testPdoConnection(
            $dbConfig['host'],
            $dbConfig['port'],
            $dbConfig['database'],
            $dbConfig['username'],
            $dbConfig['password']
        );

        // Auto-heal if password was provided/autofilled but MySQL root has no password
        if (!$testRes['success'] && !empty($dbConfig['password'])) {
            $emptyRes = $this->testPdoConnection(
                $dbConfig['host'],
                $dbConfig['port'],
                $dbConfig['database'],
                $dbConfig['username'],
                ''
            );
            if ($emptyRes['success']) {
                $dbConfig['password'] = '';
                session(['install_db' => $dbConfig]);
                $testRes = $emptyRes;
            }
        }

        if (!$testRes['success']) {
            return redirect()->route('install.database')->with('error', $testRes['message']);
        }

        try {
            // Enforce process and superglobals environment variables for MySQL
            putenv("DB_CONNECTION=mysql");
            putenv("DB_HOST={$dbConfig['host']}");
            putenv("DB_PORT={$dbConfig['port']}");
            putenv("DB_DATABASE={$dbConfig['database']}");
            putenv("DB_USERNAME={$dbConfig['username']}");
            putenv("DB_PASSWORD={$dbConfig['password']}");
            $_ENV['DB_CONNECTION'] = 'mysql';
            $_ENV['DB_HOST'] = $dbConfig['host'];
            $_ENV['DB_PORT'] = $dbConfig['port'];
            $_ENV['DB_DATABASE'] = $dbConfig['database'];
            $_ENV['DB_USERNAME'] = $dbConfig['username'];
            $_ENV['DB_PASSWORD'] = $dbConfig['password'];
            $_SERVER['DB_CONNECTION'] = 'mysql';
            $_SERVER['DB_HOST'] = $dbConfig['host'];
            $_SERVER['DB_PORT'] = $dbConfig['port'];
            $_SERVER['DB_DATABASE'] = $dbConfig['database'];
            $_SERVER['DB_USERNAME'] = $dbConfig['username'];
            $_SERVER['DB_PASSWORD'] = $dbConfig['password'];

            // 1. Set dynamic config in runtime and enforce MySQL as default
            config([
                'app.name' => $request->app_name,
                'app.url' => $request->app_url,
                'database.default' => 'mysql',
                'database.connections.mysql.host' => $dbConfig['host'],
                'database.connections.mysql.port' => $dbConfig['port'],
                'database.connections.mysql.database' => $dbConfig['database'],
                'database.connections.mysql.username' => $dbConfig['username'],
                'database.connections.mysql.password' => $dbConfig['password'],
            ]);

            DB::purge('mysql');
            DB::setDefaultConnection('mysql');
            DB::reconnect('mysql');

            // 2. Generate APP_KEY if missing
            if (empty(env('APP_KEY')) && empty(config('app.key'))) {
                Artisan::call('key:generate', ['--force' => true]);
            }

            // Ensure sqlite fallback file exists if referenced anywhere
            if (!file_exists(database_path('database.sqlite'))) {
                @touch(database_path('database.sqlite'));
            }

            // 3. Run Migrations & Seeders specifically on MySQL
            Artisan::call('migrate:fresh', ['--database' => 'mysql', '--force' => true]);
            Artisan::call('db:seed', ['--database' => 'mysql', '--force' => true]);

            // 4. Create / Update Super Admin User
            // Purge any pre-existing or conflicting accounts (including soft-deleted) across email, username, or mobile
            User::withTrashed()
                ->where('email', $request->admin_email)
                ->orWhere('username', $request->admin_username)
                ->orWhere('mobile', $request->admin_mobile)
                ->forceDelete();

            $superAdmin = User::create([
                'name' => $request->admin_name,
                'email' => $request->admin_email,
                'username' => $request->admin_username,
                'mobile' => $request->admin_mobile,
                'password' => Hash::make($request->admin_password),
                'type' => 'admin',
                'is_active' => '1',
            ]);

            if (!$superAdmin->hasRole('Super Admin')) {
                $superAdmin->assignRole('Super Admin');
            }

            // 5. Create storage/installed lock file BEFORE modifying .env
            file_put_contents(storage_path('installed'), json_encode([
                'installed_at' => now()->toIso8601String(),
                'version' => '1.0.0',
                'app_name' => $request->app_name,
                'app_url' => $request->app_url,
                'admin_email' => $request->admin_email,
            ], JSON_PRETTY_PRINT));

            // 6. Update .env file (now that all database work and lock file are committed)
            $this->updateEnv([
                'APP_NAME' => $request->app_name,
                'APP_URL' => $request->app_url,
                'DB_CONNECTION' => 'mysql',
                'DB_HOST' => $dbConfig['host'],
                'DB_PORT' => $dbConfig['port'],
                'DB_DATABASE' => $dbConfig['database'],
                'DB_USERNAME' => $dbConfig['username'],
                'DB_PASSWORD' => $dbConfig['password'],
            ]);

            // Clear session DB config
            session()->forget('install_db');

            return redirect()->route('install.finish')->with([
                'admin_email' => $request->admin_email,
                'admin_username' => $request->admin_username,
            ]);
        } catch (\Throwable $e) {
            Log::error('Installation failed: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            return back()->withInput()->with('error', 'Installation error: ' . $e->getMessage());
        }
    }

    /**
     * Step 5: Finish & Success
     */
    public function finish()
    {
        return view('installer.finish');
    }

    /**
     * Helper to write key-values into .env
     */
    private function updateEnv(array $values)
    {
        $envPath = base_path('.env');
        if (!file_exists($envPath)) {
            if (file_exists(base_path('.env.example'))) {
                copy(base_path('.env.example'), $envPath);
            } else {
                touch($envPath);
            }
        }

        $content = file_get_contents($envPath);

        foreach ($values as $key => $value) {
            $formattedValue = (str_contains($value, ' ') || str_contains($value, '#'))
                ? "\"{$value}\""
                : $value;

            if (preg_match("/^{$key}=.*/m", $content)) {
                $content = preg_replace("/^{$key}=.*/m", "{$key}={$formattedValue}", $content);
            } else {
                $content .= "\n{$key}={$formattedValue}";
            }
        }

        file_put_contents($envPath, $content);
    }
}
