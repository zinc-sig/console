import React, { useContext, useReducer} from "react"

interface FilesAction {
  type: string;
  payload?: any;
}

interface File{
    lastModified: number
    name: string
    path: string
    size: number
    type: string
    webkitRelativePath: string
}

interface FilesState {
  provided: File[]
  skeleton: File[]
  template: File[]
}


function filesReducer(state: FilesState, action: FilesAction): FilesState {
  const { type, payload: { folder, file }} = action;
  switch (type) {
    case 'addFile':
        return {...state, [folder]: [...new Set([...state[folder], file])]}
    case 'removeFile':
        return {...state, [folder]: [...new Set(state[folder].filter(fileName => fileName.path!==file.path))]}
    default:
        return state;
  }
}

const initialLayoutState: FilesState = {
  provided: [],
  skeleton: [],
  template: []
}

interface LayoutProviderProps {
  children: React.ReactNode
}

const FilesStateContext = React.createContext({} as FilesState);
const FilesDispatchContext = React.createContext({} as React.Dispatch<FilesAction>)

export const useFilesState = () => useContext(FilesStateContext)
export const useFilesDispatch = () => useContext(FilesDispatchContext);


export const FilesProvider = ({ children }: LayoutProviderProps) => {
    const [state, dispatch] = useReducer<React.Reducer<FilesState, FilesAction>>(filesReducer, initialLayoutState)

    return (
        <FilesDispatchContext.Provider value={dispatch}>
        <FilesStateContext.Provider value={state}>
            { children }
        </FilesStateContext.Provider>
        </FilesDispatchContext.Provider>
    )
}

