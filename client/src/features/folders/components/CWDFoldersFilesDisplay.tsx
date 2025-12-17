import React from "react";
import { FileIcon } from "../../../assets/icons/FileIcon";
import { FolderIcon } from "../../../assets/icons/FolderIcon";
import styles from "./CWDFoldersFilesDisplay.module.css";
import { IFileResponse, IFolderResponse } from "../../../../../shared/models/IFolderFileResponse";
import { Link } from "react-router-dom";

type ICWDFoldersFilesDisplayProps = {
    setFileInfoData: React.Dispatch<React.SetStateAction<IFileResponse | null>>;
    openFileInfoDialog: () => void;

    cwdFolders: IFolderResponse[] | null,
    cwdFiles: IFileResponse[] | null
};




export function CWDFoldersFilesDisplay({
    setFileInfoData,
    openFileInfoDialog,

    cwdFiles,
    cwdFolders
}: ICWDFoldersFilesDisplayProps) {





    return (
        <div className={styles.cwdFoldersFilesContainer}>

            <div className={styles.headerContainer}>

                <h2 className={`${styles.sectionHeader} ${styles.sectionName}`}>Name</h2>

                <p className={`${styles.sectionHeader} ${styles.sectionType}`}>Type</p>

                <p className={`${styles.sectionHeader} ${styles.sectionDate}`}>Created</p>

            </div>


            <div className={styles.itemsContainer}>

                {
                    (cwdFiles !== null && cwdFolders !== null) &&

                        (cwdFiles.length > 0 || cwdFolders.length > 0) ? (
                        <>

                            {
                                cwdFolders.map((folder) => {
                                    return (
                                        <Link to={`/folder/${folder.id}`} className={styles.itemRow}>
                                            <span className={styles.itemName}>{folder.name}</span>
                                            <span className={styles.itemType}>
                                                <FolderIcon />
                                            </span>
                                            <span className={styles.itemDate}>December 11, 2025</span>
                                        </Link>
                                    )
                                })

                            }
                            {
                                cwdFiles.map((file) => {
                                    return (
                                        <div
                                            key={file.id}
                                            className={styles.itemRow}
                                            onClick={() => {
                                                setFileInfoData({
                                                    id: file.id,
                                                    name: file.name,
                                                    size: file.size,
                                                    fileType: file.fileType,
                                                    createdAt: file.createdAt,
                                                    parentFolderId: file.parentFolderId
                                                });
                                                openFileInfoDialog();
                                            }}
                                        >
                                            <span className={styles.itemName}>AHJDBJDF</span>
                                            <span className={styles.itemType}>
                                                <FileIcon />
                                            </span>
                                            <span className={styles.itemDate}>December 1, 2012</span>
                                        </div>
                                    )
                                })


                            }

                        </>
                    )
                        :

                        <p className={styles.placeholderText}>No folders or files to display.</p>



                }

                {/* <p className={styles.placeholderText}>No folders or files to display.</p> */}


                {/* <div className={styles.itemRow}>
                    <span className={styles.itemName}>ProjectPlan.docx</span>
                    <span className={styles.itemType}>
                        <FolderIcon />
                    </span>
                    <span className={styles.itemDate}>December 11, 2025</span>
                </div>

                <div className={styles.itemRow}>
                    <span className={styles.itemName}>Whatav</span>
                    <span className={styles.itemType}>
                        <FolderIcon />
                    </span>
                    <span className={styles.itemDate}>December 13, 2025</span>
                </div>

                <div
                    className={styles.itemRow}
                    onClick={() => {
                        setFileInfoData({
                            id: "file-123",
                            name: "AHJDBJDF",
                            size: 2,
                            fileType: "JPEG Image",
                            createdAt: new Date("2012-12-01"),
                            parentFolderId: "folder-456"
                        });
                        openFileInfoDialog();
                    }}
                >
                    <span className={styles.itemName}>AHJDBJDF</span>
                    <span className={styles.itemType}>
                        <FileIcon />
                    </span>
                    <span className={styles.itemDate}>December 1, 2012</span>
                </div> */}


            </div>
        </div>
    );
}