import React, { useState, useEffect, useRef }  from "react"
import { useDrag, useDrop, DndProvider } from 'react-dnd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile, faUpload} from '@fortawesome/pro-duotone-svg-icons'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Dropzone from 'react-dropzone'
import { useLayoutDispatch, useLayoutState } from "../contexts/layout";
import axios from 'axios'
import { useFilesState, useFilesDispatch } from "../contexts/assignmentSupportingFiles"
import {useFloating, shift, arrow, getScrollParents} from '@floating-ui/react-dom';

const UPLOAD_DIR = '/tmp/helpers'

interface CachedFile{
    lastModified: number
    name: string
    path: string
    size: number
    type: string
    webkitRelativePath: string
}

interface ExistedFile{
    name: string
    files: string[]
    tree: tree
}

interface tree{
    children: tree[]
    name: string
    path: string
    type: string
    size: number
}

function FileWrap({existing, file, children}){
    function dragHandle(){
        return{
            type: 'file',
            item: file
        }
    }
    const [, drag] = useDrag(dragHandle)
    if (!existing){
        return (
            <div className="flex flex-row px-2 py-1 border border-gray-300 bg-gray-200 hover:shadow-md transition-all duration-350 ease-in-out justify-between rounded w-40 items-center gap-x-1 w-full" ref={drag}>
                {children}
            </div>
        )
    }
    return(
        <div className="flex flex-row px-2 py-1 border border-gray-300 bg-gray-200 hover:shadow-md transition-all duration-350 ease-in-out justify-between rounded w-40 items-center gap-x-1 w-full">
            {children}
        </div>
    )
}

function File({fileObject, folder}){
    const {file} = fileObject
    const { assignmentConfigId } = useLayoutState();
    // var path = ""
    var existing = !(file.size !== undefined)
    var path = ""
    if(!existing)
        path = file.path
    else{
        path = file.path.replace(UPLOAD_DIR+'/'+assignmentConfigId+'/'+folder.toLowerCase(),'')    
    }
    return(
        <FileWrap existing={existing} file={file}>
            <div className='flex flex-row items-center space-x-2 truncate'>
                <div className="w-3 text-gray-600 mx-1">
                    <FontAwesomeIcon icon={faFile} />
                </div>
                <div className="text-gray-700 font-medium text-sm w-fit truncate ...">
                    {path}
                </div>
            </div>
            <button onClick = {()=>{fileObject.deleteFile(file)}}  className="mx-2">
                <FontAwesomeIcon className="text-red-400 cursor-pointer" icon={['far', 'times']}/>
            </button>
        </FileWrap>
    )
}

function DockingFile({files,file,setFiles}){
    const [, drag] = useDrag(()=>({
            type: 'file',
            item: file
        }))
    function setFile(){
        setFiles([...new Set(files.filter(x => x.path != file.path))])
    }
    return(
            <div className="flex flex-row px-2 py-1 border border-gray-300 bg-gray-200 hover:shadow-md transition-all duration-350 ease-in-out justify-between rounded items-center gap-x-1 w-full" ref={drag}>
                <div className='flex flex-row items-center space-x-2 truncate'>
                    <div className="w-3 text-gray-600 mx-1">
                        <FontAwesomeIcon icon={faFile} />
                    </div>
                    <div className="text-gray-700 font-medium text-sm w-fit truncate ...">
                        {file.path}
                    </div>
                </div>
                <button onClick = {setFile} className="mx-2">
                    <FontAwesomeIcon className="text-red-400 cursor-pointer" icon={['far', 'times']}/>
                </button>
            </div>
    )
}

function DockingArea({files, setFiles}){
    const [, drop] = useDrop(() => ({
        accept: 'file',
        drop: (item) => {
            setFiles([...new Set([...files, item])])
        }
    }), [files])
    const {x, y, reference, floating, strategy, update, refs} =
    useFloating({
        placement: 'bottom',
        // middleware: [shift()],
    });
    // Update on scroll and resize for all relevant nodes
    useEffect(() => {
        function showTooltip(){
            refs.floating.current!.classList.remove("hidden")
            refs.floating.current!.classList.add("flex")
            update();
        }
        function hideTooltip(){
            refs.floating.current!.classList.remove("flex")
            refs.floating.current!.classList.add("hidden")
            update();
        }
        if(files.length !== 0){
            [
                ['mouseenter', showTooltip],
                ['mouseleave', hideTooltip],
                ['focus', showTooltip],
                ['blur', hideTooltip],
            ].forEach(([event, listener]) => {
                //@ts-ignore
                refs.reference.current!.addEventListener(event, listener);
            });
            console.log('inside')
            return()=>{
                [
                    ['mouseenter', showTooltip],
                    ['mouseleave', hideTooltip],
                    ['focus', showTooltip],
                    ['blur', hideTooltip],
                ].forEach(([event, listener]) => {
                    //@ts-ignore
                    refs.reference.current!.removeEventListener(event, listener);
                });
                hideTooltip();
            }
        }
    }, [files]);
    return(
        <>
            <div ref={reference} className="w-full p-4 rounded bg-gray-100">
                <div className="flex flex-col space-y-2 max-h-44 overflow-y-scroll" ref={drop} >
                    {files.map((file)=>(<DockingFile key={file} file={file} files={files} setFiles={setFiles}/>))}
                </div>
            </div>
            <div
                ref={floating}
                style={{
                    position: strategy,
                    top: y ?? '',
                    left: x ?? '',
                }}
                className="hidden transition duration-100 ease-in-out flex-row"
            >
                <div className="bg-white rounded border p-2 w-80 text-sm text-gray-700">
                    Please drag the file on the list to the following three columns
                </div>
            </div>
        </>
    )
}

function FileList({existingFiles, name}){
    // const [cachedFiles, setCachedFiles] =  useState<CachedFile[]>([])
    var cachedFiles: CachedFile[] = []
    const {provided, skeleton, template} = useFilesState()
    var description = ""
    const setFile = ()=>{
        switch(name){
            case "provided":
                cachedFiles = provided
                description = "this is an description for provided"
                break;
            case "skeleton":
                cachedFiles = skeleton
                description = "this is an description for skeleton"
                break;
            case "template":
                cachedFiles = template
                description = "this is an description for template"
                break;
            default:
                cachedFiles = []
        }
    }
    setFile()
    const filesDispatch = useFilesDispatch()
    const layoutDispatch = useLayoutDispatch()
    const addFunction = (file)=>{
        filesDispatch({ type: 'addFile', payload: {folder:name, file:file}})
        // setFile()
    }   
    const deleteFunction = (file)=>{
        filesDispatch({ type: 'removeFile', payload: {folder:name, file:file}})
        // setFile()
    }

    const [, drop] = useDrop(() => ({
        accept: 'file',
        drop: (item: CachedFile) => {
            addFunction(item)
        }
    }), [cachedFiles])
    
    const { assignmentConfigId } = useLayoutState();

    return (
        <div className="rounded border bg-gray-100 p-2 shadow flex flex-col space-y-2 w-60" ref={drop} >
            <div className="uppercase text-gray-600 font-medium mx-1 text-xs">
                {name}
            </div>
            <div className="text-sm text-gray-500 px-1 h-10">
                {description}
            </div>

            {[...existingFiles, ...cachedFiles].map((file)=>{
                if (file.size !== undefined){
                    return ({
                        deleteFile: deleteFunction,
                        file
                    })
                }
                return ({
                    deleteFile: async (file)=>{
                        var res = await fetch(`/api/configs/${assignmentConfigId}/helpers?path=${file.path}&type=${file.type}`,{
                            method: 'DELETE'
                            // body:JSON.stringify(file)
                        })
                        layoutDispatch({ type: 'toggleModal', payload: {}});
                        // removeExistedFileState(file.path, name)
                    },
                    file
                })
            }).map((file) => (
                    //@ts-ignore
                    <File key={file.file.path} fileObject={file} folder={name}/>
            ))}
            {/* <ExistedFilesDisplay tree={tree}/> */}
        </div>
    )
}

// function ExistedFilesDisplay({tree}){
//     return(
//         <div>
//             <ul className="border border-gray-200 rounded-md m-4">
//                 <li key={tree.name} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm leading-5">
//                     <div className="w-0 flex-1 flex items-center">
//                         <FontAwesomeIcon className="flex-shrink-0 h-5 w-5 text-gray-500" icon={['fad', tree.type==='directory'?'folder':'file' ]}/>
//                         <span className="ml-2 flex-1 w-0 truncate">
//                         { tree.name }
//                         </span>
//                     </div>
//                 </li>
//                 {
//                     tree.children!==undefined && (
//                         <ul className="border border-gray-200 rounded-md m-4">
//                             {
//                                 tree.children.map(node => (
//                                     <ExistedFilesDisplay tree={node}/>
//                                 ))
//                             }
//                         </ul>
//                     )
//                 } 
//             </ul>
            
//             {
//                 tree.children!==undefined && (
//                 <ul className="border border-gray-200 rounded-md m-4">
//                     {
//                     tree.children.map(node => (
//                         <li key={node.name} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm leading-5">
//                         <div className="w-0 flex-1 flex items-center">
//                             <FontAwesomeIcon className="flex-shrink-0 h-5 w-5 text-gray-500" icon={['fad', node.type==='directory'?'folder':'file' ]}/>
//                             <span className="ml-2 flex-1 w-0 truncate">
//                             { node.name }
//                             </span>
//                         </div>
//                         </li>
//                     ))
//                     }
//                 </ul>
//                 )
//             }
//             {
//                 tree===null && (
//                 <div className="bg-gray-200 rounded-md p-12 m-8 flex flex-col justify-center items-center">
//                     <FontAwesomeIcon className="text-gray-400" icon={['fad', 'file-import']} size="2x"/>
//                     <h4 className="font-medium mt-2 text-sm">No grading package uploaded</h4>
//                     <p className="text-xs mt-1 text-gray-500 text-center">You can import the required grading package files via uploading from below</p>
//                 </div>
//                 )
//             }
//         </div>
//     )
// }

function AssignmentSupportingFilesUploader(){
    const [dockingFiles, setDockingFiles] = useState<CachedFile[]>([])
    const [existedFiles, setExistedFiles] = useState<ExistedFile[]>([])
    const { assignmentConfigId } = useLayoutState()
    const {provided, skeleton, template} = useFilesState()
    useEffect(()=>{
        const fetchExistedFiles = async () =>{
            const response = await fetch(`/api/configs/${assignmentConfigId}/helpers`, {
                method:"GET"
            })
            const {result} = await response.json()
            setExistedFiles(result)
        }   
        fetchExistedFiles()
    },[])
    const addDockingFiles = async (files)=>{
        setDockingFiles([...new Set([...dockingFiles, ...files])])
    }
    const dispatch = useLayoutDispatch();

    const handleSubmit = () => async () => {
        const uploadFiles = {
          'provided':provided,
          'skeleton':skeleton, 
          'template':template
        }
        const fd = new FormData()
        Object.entries(uploadFiles).forEach(
          ([folder, files]) => {
            Object.entries(files).forEach(
                ([_, file]) => {
                    //TODO: upload the path['path'] to folder
                    // @ts-ignore
                    fd.append('files', file, folder+'/'+file.path)
                }
            );
          }
        );
        try {
            const { data } = await axios({
                method: 'post',
                url: `/api/configs/${assignmentConfigId}/helpers`,
                data: fd,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
        } catch (error) {
          console.error(error)
        }
        dispatch({ type: 'closeModal' })
    }

    return(
        <div className="space-y-4 flex flex-col shadow-xl bg-cool-gray-50 pb-4 h-fit">
            <header className="space-y-1 py-6 bg-cse-600 sm:px-6">
                <div className="flex items-center justify-between space-x-3">
                    <h2 className="text-lg leading-7 font-medium text-white">
                        Complementary Files
                    </h2>
                    <div className="h-7 flex items-center">
                        <button
                        onClick={() => dispatch({ type: 'closeModal' })}
                        aria-label="Close panel"
                        className="text-cse-200 hover:text-white transition ease-in-out duration-150 focus:outline-none">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        </button>
                    </div>
                </div>
                <div>
                <p className="text-sm leading-5 text-cse-300">
                    Manages assignment&apos;s grading required package / skeleton files 
                </p>
                </div>
            </header>
            <div className="overflow-auto">
                <DndProvider backend={HTML5Backend}>
                    <div className="flex flex-col justify-center items-center space-y-4">
                        <Dropzone onDrop={addDockingFiles}>
                            {({ getRootProps, getInputProps }) => (
                                <div className="grid grid-cols-2 shadow-md p-2 rounded-md w-3/4">    
                                    <div
                                    {...getRootProps()}
                                    className="rounded p-10 flex flex-col items-center gap-y-4 cursor-pointer">
                                        <input {...getInputProps()} />
                                        <div className="text-gray-600 text-6xl">
                                            <FontAwesomeIcon icon={faUpload} />
                                        </div>
                                        <p className="text-center text-gray-600">
                                            Drag and Drop file or click to select files
                                        </p>
                                    </div>
                                    <DockingArea files={dockingFiles} setFiles={setDockingFiles}/>
                                </div>
                            )}
                        </Dropzone>
                        <div className="flex flex-row justify-between space-x-4 w-3/4">
                            {existedFiles.map((folder)=>(
                                <FileList key={folder.name} name={folder.name} existingFiles={folder.files}></FileList>
                            ))}
                        </div>
                    </div>
                </DndProvider>
            </div>
            <div className="w-full flex justify-center ">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-1/4" 
                    onClick ={handleSubmit()}>
                        Save
                </button>
            </div>
        </div>
    )
}

export default AssignmentSupportingFilesUploader

