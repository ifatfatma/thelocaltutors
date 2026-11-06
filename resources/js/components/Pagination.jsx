import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links = [] }) {
    if (!links || links.length <= 3) return null;

    return (
        <nav aria-label="Page navigation" className="my-4">
            <ul className="pagination justify-content-center flex-wrap">
                {links.map((link, index) => {
                    if (link.url === null) {
                        return (
                            <li key={index} className="page-item disabled">
                                <span
                                    className="page-link"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            </li>
                        );
                    }
                    return (
                        <li
                            key={index}
                            className={`page-item ${link.active ? 'active' : ''}`}
                        >
                            <Link
                                href={link.url}
                                className="page-link"
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
