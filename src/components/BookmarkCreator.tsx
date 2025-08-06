import React from 'react';

interface Bookmark {
    title: string;
    page: number;
}

interface BookmarkCreatorProps {
    fileNames: string[];
}

const BookmarkCreator: React.FC<BookmarkCreatorProps> = ({ fileNames }) => {
    const createBookmarks = (): Bookmark[] => {
        return fileNames.map((fileName, index) => ({
            title: fileName,
            page: index + 1, // Assuming each file corresponds to a page in the final PDF
        }));
    };

    const bookmarks = createBookmarks();

    return (
        <div>
            <h3>Generated Bookmarks</h3>
            <ul>
                {bookmarks.map((bookmark) => (
                    <li key={bookmark.title}>
                        {bookmark.title} - Page {bookmark.page}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookmarkCreator;