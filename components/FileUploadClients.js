import React from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

// eslint-disable-next-line no-unused-vars
export default function FileUploadClients({ values, setValues, loadingUpload }) {
    const fileUploadAndResize = async (e) => {
        console.log(e.target.files);
        if (values.image !== "") {
            const res = await axios.post("/api/admin/clients/imagesdeleted", { deletedImage: values.image });
            console.log(res.data);
            setValues({ ...values, image: "" });
        }

        let files = e.target.files;
        console.log(files);
        let allUploadedFiles = values.image;

        const config = {
            headers: { "content-type": "multipart/form-data" },
        };

        if (files) {
            // eslint-disable-next-line no-unused-labels
            loadingUpload: true;

            for (let i = 0; i < files.length; i++) {
                Resizer.imageFileResizer(
                    files[i],
                    720,
                    720,
                    "JPEG",
                    100,
                    0,
                    async () => {
                        const form = new FormData();
                        form.append("clientImage", e.target.files[i]);
                        console.log(form);
                        try {
                            const res = await axios.post(
                                "/api/admin/clients/imagesupload",
                                form,
                                config
                            );
                            allUploadedFiles = res.data.file;
                            setValues({ ...values, image: allUploadedFiles });
                            // eslint-disable-next-line no-unused-labels
                            loadingUpload: false;
                        } catch (error) {
                            console.log("UPLOAD IMAGES ERROR ...", error);
                            // eslint-disable-next-line no-unused-labels
                            loadingUpload: false;
                        }
                    },
                    "base64"
                );
            }
        }
    };

    const handleImageRemove = async (image) => {
        try {
            // eslint-disable-next-line no-unused-labels
            loadingUpload: true;
            const res = await axios.post("/api/admin/clients/imagesdeleted", {
                deletedImage: image,
            });
            console.log(res.data);
            setValues({ ...values, image: "" });
            // eslint-disable-next-line no-unused-labels
            loadingUpload: false;
        } catch (error) {
            console.log(error);
            // eslint-disable-next-line no-unused-labels
            loadingUpload: false;
        }
    };

    return (
        <>
            <div className="flex justify-center items-center">
                {values.image ?
                    <>
                        <div className="relative">
                            <div className="flex items-center justify-center w-72 h-120 mx-2 overflow-hidden rounded-2xl">
                                <Image
                                    src={`/uploads/clients/${values.image}`}
                                    className="object-content"
                                    width={384}
                                    height={640}
                                    alt=""
                                />
                            </div>

                            <div className="absolute top-0 right-0 w-4 h-6 mr-1 rounded-sm bg-red-700 border-1 border-outline">
                                <a>
                                    <FontAwesomeIcon
                                        icon={faTrashAlt}
                                        className="h-4 w-4 text-white"
                                        onClick={() => handleImageRemove(values.image)}
                                    />
                                </a>
                            </div>
                        </div>
                    </> : ""}
            </div>

            <div className="row mt-4 mb-2">
                <label className="secondary-button">
                    Upload image
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={fileUploadAndResize}
                    />
                </label>
            </div>
        </>
    );
}

FileUploadClients.auth = { adminOnly: true };