import React from "react";
import { IFolderResponse } from "../../../../../shared/models/IFolderFileResponse";
import styles from "./ParentFolderRouteDisplay.module.css";
import { Link } from "react-router-dom";


type IParentFolderRouteDisplayProps = {
    parentFolders: IFolderResponse[] | null,

    foldersUrl: string
}


export function ParentFolderRouteDisplay({
    parentFolders,

    foldersUrl
}: IParentFolderRouteDisplayProps) {




    return (
        <div className={styles.parentFolderRouteContainer}>



            <span className={styles.separator}>:</span>


            {
                parentFolders !== null &&
                    [...parentFolders].reverse().map((folder, indx, arr) => {
                        if (indx === arr.length - 1) {
                            return (
                                <span className={`${styles.folderRouteItem} ${styles.currentFolderRouteItem}`} key={folder.id}>
                                    {folder.name}
                                </span>
                            )
                        }

                        return (
                            <React.Fragment key={folder.id}>

                                <Link className={styles.folderRouteItem} to={`${foldersUrl}${folder.id}`}>
                                    {folder.name}
                                </Link>
                                <span className={styles.separator}>&gt;</span>

                            </React.Fragment>
                        )
                    })
            }


            {/* <span className={styles.folderRouteItem}>root</span>
            <span className={styles.separator}>&gt;</span>
            <span className={styles.folderRouteItem}>Projects</span>
            <span className={styles.separator}>&gt;</span>
            <span className={styles.folderRouteItem}>2024</span>
            <span className={styles.separator}>&gt;</span>

            <span className={`${styles.folderRouteItem} ${styles.currentFolderRouteItem}`}>June</span> */}

        </div>
    );
}