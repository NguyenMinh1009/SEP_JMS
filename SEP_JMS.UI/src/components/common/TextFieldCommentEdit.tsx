import React, { useEffect, useState, useRef, useCallback } from "react";
import sanitize from "sanitize-html";
import CustomButton from "./CustomButton";
import { IoMdSend, IoMdDocument } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import ReactQuill, { Quill } from "react-quill";
import { AiFillCloseCircle } from "react-icons/ai";
//@ts-ignore
import quillEmoji from "quill-emoji";
import "quill-emoji/dist/quill-emoji.css";

import FileSection from "../FileSection";
import useSnakeBar from "../../hooks/store/useSnakeBar";
import CircularProgress from "@mui/material/CircularProgress";
import { postFileComment } from "../../api/File";
import APIClientInstance from "../../api/AxiosInstance";
import { useParams } from "react-router-dom";
import { CorrelationJobType } from "../../enums/correlationJobType";
import { VisibleType } from "../../enums/visibleType";
import ImageSection from "./ImageSection";
import { useClickOutside } from "../../utils/useClickOutside";
import CustomDialog from "./CustomDialog";
import { APIUrlHost } from "../../constants";
import useCurrentPerson from "../../hooks/store/useCurrentPerson";
import { MdSave } from "react-icons/md";

const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ align: [] }],
  ["emoji"],
  window.innerWidth > 1537 ? [{ script: "sub" }, { script: "super" }] : [], // superscript/subscript
  window.innerWidth > 1537 ? [{ indent: "-1" }, { indent: "+1" }] : [] // outdent/indent
];

const quillModules = {
  toolbar: toolbarOptions,
  "emoji-toolbar": true,
  "emoji-textarea": true,
  "emoji-shortname": true
};

const allowFileTypes: string = `image/*, 
								application/pdf, 
								application/msword, 
								application/vnd.ms-excel, 
								application/vnd.ms-powerpoint, 
								application/vnd.openxmlformats-officedocument.wordprocessingml.document, 
								application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, 
								application/vnd.openxmlformats-officedocument.presentationml.presentation`;

interface IRichTextEditorProps {
  label: string;
  commentId: string;
  reply?: boolean;
  visibleType: VisibleType;
  oldRemoteFiles?: {
    name: string;
    type?: string;
    originalName?: string;
  }[];
  oldContent: string;
  getComments: () => void;
  refreshComment: (value: string, attachments: any) => void;
  setOpenReplySection?: (open: boolean) => void;
  collapseProp?: boolean;
}

const TextFieldCommentEdit: React.FC<IRichTextEditorProps> = ({
  label,
  commentId,
  reply,
  visibleType,
  getComments,
  refreshComment,
  oldContent,
  setOpenReplySection,
  oldRemoteFiles,
  collapseProp
}) => {
  const [isOpenTaskPanel, setOpenTaskPanel] = useState(reply ? true : false);
  const [value, setValue] = useState<string>(oldContent);
  const [files, setFiles] = useState<File[]>([]);
  const [rmFiles, setRmFiles] = useState<{
    name: string;
    type?: string;
    originalName?: string;
  }[]>(oldRemoteFiles ?? []);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = React.useState(false);
  // const [tempSrc, setTempSrc] = useState<Blob | MediaSource | undefined>();

  const editorRef = useRef<any>(null);
  const wrapperRef = useRef<any>(null);

  const currentPerson = useCurrentPerson();

  useEffect(() => { });
  useClickOutside(
    wrapperRef,
    () => {
      if (isOpenTaskPanel && !openConfirmDialog && reply === undefined) setOpenConfirmDialog(true);
    },
    ".reply-btn"
  );

  const snakeBar = useSnakeBar();

  Quill.register(
    {
      "formats/emoji": quillEmoji.EmojiBlot,
      "modules/emoji-toolbar": quillEmoji.ToolbarEmoji,
      "modules/emoji-textarea": quillEmoji.TextAreaEmoji,
      "modules/emoji-shortname": quillEmoji.ShortNameEmoji
    },
    true
  );

  const fileHandler = () => {
    const input: HTMLInputElement = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", allowFileTypes);
    input.setAttribute("multiple", "multiple");
    input.click();
    input.onchange = (e: any) => {
      const fileList = Array.from(input.files ?? []);
      setFiles(prev => [...prev, ...fileList]);
    };
  };

  const handleDeleteFile = (name: string) => {
    const clone = [...files];
    const deleteFileIndex = clone.findIndex(file => file.name === name);
    if (deleteFileIndex > -1) clone.splice(deleteFileIndex, 1);
    setFiles(clone);
  };

  const handleDeleteRemoteFile = (name: string) => {
    const clone = [...rmFiles];
    const deleteFileIndex = clone.findIndex(file => file.name === name);
    if (deleteFileIndex > -1) clone.splice(deleteFileIndex, 1);
    setRmFiles(clone);
  };

  const getImagesFils = React.useMemo(() => {
    return Array.from(files).filter(file => file.type.includes("image"));
  }, [files]);

  const getDocumentsFils = React.useMemo(() => {
    return Array.from(files).filter(
      file => !file.type.includes("image") && allowFileTypes.includes(file.type)
    );
  }, [files]);

  const getSanitizeText = (input: string) => {
    return sanitize(input, {
      allowedTags: sanitize.defaults.allowedTags.concat(["img"]),
      allowedAttributes: false,
      allowedSchemes: ["data", "http", "https"],
      transformTags: {
        br: ""
      }
    });
  };
  const handleEditComment = () => {
    const totalSizeInBytes = files.reduce((total, file) => total + file.size, 0);
    if (totalSizeInBytes / (1024 * 1024) > 50) {
      snakeBar.setSnakeBar("Tổng file vượt quá 50MB!", "warning", true);
      return;
    }
    setLoading(true);
    const formData = new FormData();
    const commentPayloadData = {
      Content: getSanitizeText(value),
      OldFiles: JSON.stringify(rmFiles.map(e => ({
        fileName: e.name,
        mimeType: e.type,
        originalName: e.originalName
      })))
    };
    files.forEach(item => formData.append("Files", item));
    Object.entries(commentPayloadData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });


    APIClientInstance.put(`comment/${commentId}`, formData)
      .then((rs) => {
        snakeBar.setSnakeBar("Chỉnh sửa bình luận thành công!", "success", true);
        refreshComment(rs.data.content, rs.data.attachments);
        // getComments();
        setValue("");
        setFiles([]);
        setLoading(false);
        setOpenReplySection?.(false);
        if (reply === undefined) setOpenTaskPanel(false);
      })
      .catch(_err => {
        setLoading(false);
        snakeBar.setSnakeBar("Có lỗi xảy ra!", "error", true);
      })
      .finally(() => setLoading(false))


  };

  const handleClose = () => {
    setOpenConfirmDialog(false);
  };

  useEffect(() => {
    if (isOpenTaskPanel) {
      if (editorRef.current) {
        const inputField = editorRef.current.querySelector(".ql-editor");
        if (inputField) {
          inputField.focus();
        }
      }
    }
  }, [isOpenTaskPanel, editorRef]);

  const getLabelFromType = (): string => {
    if (reply) return "Chỉnh sửa bình luận";
    else {
      if (isOpenTaskPanel) return "Thu gọn";
      return label;
    }
  };
  return (
    <div
      ref={wrapperRef}
      className="text-comment-container sticky bottom-0 flex flex-col hyphens-auto bg-white shadow-custom"
    >
      <CustomDialog
        openDialog={openConfirmDialog}
        handleClose={handleClose}
        title="Cảnh báo - comment chưa hoàn thành!"
        description="Nội dung comment sẽ bị xóa, bạn có chắc không?"
        primaryBtnText="Tiếp tục comment"
        secondaryBtnText="Đồng ý hủy"
        primaryBtnCallback={handleClose}
        secondaryBtnCallback={() => setOpenTaskPanel(false)}
      />
      <div className="reply-btn flex w-full max-w-full grow-0 items-center gap-4 overflow-hidden bg-white px-5 py-3">
        <div className="h-8 w-8 rounded-full bg-slate-500">
          <img
            src={APIUrlHost + "/" + currentPerson.avatarUrl + "?t=0"}
            className="h-full w-full rounded-full"
            alt=""
          />
        </div>
        <div className="flex-1">
          <div className="flex gap-3 rounded-md bg-white">
            <div className="flex flex-1 items-center gap-3">
              <div
                onClick={() => {
                  if (reply === undefined) setOpenTaskPanel(!isOpenTaskPanel);
                }}
                className="text-secondary flex-1 cursor-pointer select-none border-0 bg-white outline-none"
                placeholder="Start creating your task"
              >
                {getLabelFromType()}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CustomButton
                primary
                onClick={handleEditComment}
                disabled={
                  !(
                    getSanitizeText(value).trim() !== "" &&
                    getSanitizeText(value).trim() !== "<p></p>"
                  ) || isLoading
                }
              >
                <MdSave color="white" size={16} />
              </CustomButton>
              {isLoading && <CircularProgress size={20} />}
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {(reply || isOpenTaskPanel) && (
          <motion.div
            ref={editorRef}
            // onBlur={() => setOpenTaskPanel(false)}
            className={`-mt-1 origin-top bg-white`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ type: "easeInOut", duration: 0.25 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <ReactQuill
              modules={quillModules}
              className="bg-white"
              theme="snow"
              value={value}
              onChange={setValue}
            />
            <div className="min-h-fit w-full rounded-b-md bg-white px-7 py-5 pb-2">
              <div className="flex w-full items-center justify-between">
                <CustomButton className="mb-2" onClick={fileHandler} disablePadding>
                  <div className="flex items-start gap-2">
                    <IoMdDocument size={15} color="#555" />
                    <div className="text-secondary mt-[1px] text-[13px] normal-case opacity-70">
                      Thêm file
                    </div>
                  </div>
                </CustomButton>
                {files.length > 0 && (
                  <CustomButton className="mb-3" onClick={() => setFiles([])} disablePadding>
                    <AiFillCloseCircle size={20} color="#f31f20" />
                  </CustomButton>
                )}
              </div>
              {rmFiles && (<FileSection visibleType={visibleType} remoteFileList={rmFiles} handleDelete={handleDeleteRemoteFile} />)}
              <FileSection visibleType={visibleType} fileList={getDocumentsFils} handleDelete={handleDeleteFile} />

              {getImagesFils && getImagesFils.length > 0 ? (
                <ImageSection imgFiles={getImagesFils} handleDelete={handleDeleteFile} />
              ) : (
                <></>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TextFieldCommentEdit;
