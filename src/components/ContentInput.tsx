import React, { useState } from 'react';

const ContentInput: React.FC = () => {
    const [fileNames, setFileNames] = useState<string>('');

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFileNames(event.target.value);
    };

    return (
        <div>
            <h2>Paste File Names</h2>
            <textarea
                value={fileNames}
                onChange={handleInputChange}
                placeholder="Enter file names here, one per line"
                rows={10}
                cols={30}
            />
        </div>
    );
};

export default ContentInput;