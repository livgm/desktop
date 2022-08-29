// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {ConfigDownloadItem} from 'types/config';

import {Constants} from './constants';

const bytesToMegabytes = (bytes: number): string => {
    return (bytes / 1024 / 1024).toFixed(1).replace('.0', '');
};

const getETA = (item: ConfigDownloadItem) => {
    const elapsedTime = Math.round((new Date().getTime() - Math.floor(item.addedAt * 1000)) / 3600);
    return elapsedTime;
};

const bytesToMegabytesConverter = (value: number | string): string => {
    if (typeof value === 'number') {
        return bytesToMegabytes(value);
    }
    if (typeof value === 'string') {
        const parsed = parseInt(value, 10);

        if (typeof parsed === 'number') {
            return bytesToMegabytes(parsed);
        }
    }
    return 'N/A';
};

const getFileSizeOrBytesProgress = (item: ConfigDownloadItem) => {
    const totalMegabytes = bytesToMegabytesConverter(item.totalBytes);
    if (item.state === 'progressing') {
        return `${bytesToMegabytesConverter(item.receivedBytes)}/${totalMegabytes} MB`;
    }
    return `${totalMegabytes} MB`;
};

const getDownloadingFileStatus = (item: ConfigDownloadItem) => {
    switch (item.state) {
    case 'progressing':
        return `${getETA(item)} elapsed`;
    case 'completed':
        return 'Downloaded';
    case 'deleted':
        return 'Deleted';
    default:
        return 'Cancelled';
    }
};

const getIconClassName = (file: ConfigDownloadItem) => {
    if (!file.mimeType) {
        return 'generic';
    }

    // Find thumbnail icon form MIME type
    const fileType = file.mimeType.toLowerCase() as keyof typeof Constants.ICON_NAME_FROM_MIME_TYPE;
    if (fileType in Constants.ICON_NAME_FROM_MIME_TYPE) {
        return Constants.ICON_NAME_FROM_MIME_TYPE[fileType];
    }

    // Fallback to file extension
    const extension = file.location.toLowerCase().split('.').pop() as keyof typeof Constants.ICON_NAME_FROM_EXTENSION;
    if (extension && (extension in Constants.ICON_NAME_FROM_EXTENSION)) {
        return Constants.ICON_NAME_FROM_EXTENSION[extension];
    }

    // use generic icon
    return 'generic';
};

export {
    bytesToMegabytes,
    bytesToMegabytesConverter,
    getDownloadingFileStatus,
    getFileSizeOrBytesProgress,
    getIconClassName,
};
