import { Link } from "react-router-dom";
import { IFolderResponse } from "../../../../../shared/models/IFolderFileResponse";
import { FolderIcon } from "../../../assets/icons/FolderIcon";
import styles from "./FolderSidebarDisplay.module.css";

type IFolderSidebarDisplayProps = {
    folders: IFolderResponse[] | null,
    isRoot: boolean,
    parentFolderId: string | undefined
}


export function FolderSidebarDisplay({
    folders,
    isRoot,
    parentFolderId
}: IFolderSidebarDisplayProps) {



    return (
        <div className={styles.sidebarContainer}>
            <h2>Folders</h2>
            <ul className={styles.folderList}>
                {
                    !isRoot && parentFolderId &&
                    <li>
                        <Link className={styles.folderItem} to={`/folder/${parentFolderId}`}>
                            <FolderIcon />
                            <p>..</p>
                        </Link>
                    </li>
                }
                {
                    folders?.map((folder, indx) => {
                        return (
                            <li key={folder.id}>
                                <Link className={styles.folderItem} to={`/folder/${folder.id}`}>
                                    <FolderIcon />
                                    <p>{folder.name}</p>
                                </Link>
                            </li>
                        )
                    })
                }
                {/* <li>
                    <a className={styles.folderItem} href="#" target="_self">
                        <FolderIcon />
                        <p>Folder 2</p>
                    </a>
                </li>
                <li>
                    <a className={styles.folderItem} href="#" target="_self">
                        <FolderIcon />
                        <p>Folder 3</p>
                    </a>
                </li>
                <li>
                    <a className={styles.folderItem} href="#" target="_self">
                        <FolderIcon />
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis voluptates aliquam iste natus in ipsam aut mollitia placeat sint quam rerum eligendi reprehenderit deleniti harum, tenetur deserunt, doloremque itaque tempore unde explicabo? Odit quo doloribus tempora ratione accusamus? Saepe perferendis aliquam aliquid autem ipsa! Ullam nesciunt voluptate illum eos doloribus.</p>
                    </a>
                </li> */}
            </ul>
        </div>
    );
}