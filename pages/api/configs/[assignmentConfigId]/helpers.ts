import type { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
import { lstatSync, readdirSync, moveSync, removeSync } from "fs-extra";
import dirTree from "directory-tree"
import formidable from "formidable-serverless";
import AdmZip from "adm-zip";
import fs from 'fs/promises'
import dir from 'node-dir'
import path from "path";

async function handleAddHelperFiles(req: NextApiRequest, res: NextApiResponse) {
      // get base path from routing
    // const { path: pathParam } = req.query
    // const basePath = path.join(UPLOAD_DIR, ...pathParam)
    const {assignmentConfigId} = req.query
    const basePath = `${process.env.NEXT_PUBLIC_UPLOAD_DIR}/helpers/${assignmentConfigId}`

    // clear old upload (may make it configurable later)
    // await fs.rm(basePath, { recursive: true, force: true })
    // await fs.mkdir(basePath, { recursive: true })

    const form = formidable({ multiples: true, maxFileSize: 1024 * 1024 * 1024 })

    try {
        // parse form data
        const data = await new Promise((resolve, reject) =>
            form.parse(req, async (err, _, { files }) => {
                if (err) {
                    reject(err)
                }
                resolve(files)
            })
        )
        
        // handle single file case
        // TODO: extract if that single file is a zip file
        const arrayData = Array.isArray(data) ? data : [data]

        // move files into appropriate directory
        arrayData.forEach(async (file) => {
            if (file && Object.keys(file).includes("name")){
              const destPath = path.join(basePath, file.name)
              await fs.mkdir(path.dirname(destPath), { recursive: true })
              await fs.copyFile(file.path, destPath)
            }
        })
        res.json(data)
    } catch (err) {
        res.status(500).json(err)
        throw err
    }
}

// async function handleAddHelperFiles(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const form = new formidable.IncomingForm({
//       multiples: true,
//       hash: 'sha256',
//       keepExtensions: true,
//       encoding: 'utf-8'
//     });
//     form.parse(req, async (err, fields, { files }) => {
//       if(err) {
//         throw err;
//       } else {
//         const { assignmentConfigId } = req.query;
//         if(files.hash!==fields[`checksum;${files.name}`]) {
//           return res.status(500).json({
//             status: 'error',
//             error: 'Checksum mismatched, potential transmission corruption detected'
//           });
//         }
//         const zip = new AdmZip(files.path);
//         const destination = `${process.env.UPLOAD_DIR}/helpers/${assignmentConfigId}/`;
//         try {
//           const temporaryResolvePath = `/tmp/helpers/${assignmentConfigId}`;
//           zip.extractAllTo(temporaryResolvePath, true);
//           const paths = readdirSync(temporaryResolvePath);
//           const doesNotIncludeGradingPackageFolders = !paths.includes('provided') && !paths.includes('template') && !paths.includes('skeleton'); 
//           removeSync(destination);
//           moveSync(
//             paths.length===1 && lstatSync(`${temporaryResolvePath}/${paths[0]}`).isDirectory() && doesNotIncludeGradingPackageFolders?
//               `${temporaryResolvePath}/${paths[0]}`:temporaryResolvePath,
//             destination
//           );
//           return res.json({
//             status: 'success'
//           });
//         } catch (error: any) {
//           if (error.message.includes(`Cannot read property 'createSubmission' of undefined`)) {
//             return res.status(403).json({
//               status: 'error',
//               error: 'Timeline misalignment for requested submission'
//             })
//           }
//           else {
//             return res.status(500).json({
//               status: 'error',
//               error: error.message
//             });
//           }
//         }
//       }
//     });
//   } catch (error) {
//     throw error
//   }
// }

// async function handleGetHelperFiles(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const { assignmentConfigId } = req.query;
//     const path = `${process.env.UPLOAD_DIR}/helpers/${assignmentConfigId}`;
//     const result = dirTree(path, { exclude: /__MACOSX|.DS_Store/});
//     if (result) {
//       return res.json(result);
//     } else {
//       return res.json({});
//     }
//   } catch(error) {
//     throw error;
//   }
// }

function createFilesArray(tree, depth){
  // base case checking
  if(tree.children !== undefined){
    if (tree.children.length == 0){
      if(depth == 0)
        return []
      else
        return [{
          path: tree.path,
          type: tree.type
        }]
    }
  }else{
    if(depth == 0)
      return []
    else
      return [{
        path: tree.path,
        type: tree.type
      }]
  }
  
  var result:any = []
  for (let i = 0; i< tree.children.length; i++){
    result.push(...createFilesArray(tree.children[i], depth+1))
  }

  // check root and empty folder
  if (depth !== 0 && tree.type != "directory")
    result.push({
      path: tree.path,
      type: tree.type
    })
  return result
}

async function handleGetHelperFiles(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { assignmentConfigId } = req.query;
    const path = `${process.env.NEXT_PUBLIC_UPLOAD_DIR}/helpers/${assignmentConfigId}`;

    var folders = [
      {
        name: "provided",
        files: [],
        // tree: {}
      },
      {
        name: "skeleton",
        files: [],
        // tree: {}
      },
      {
        name: "template",
        files: [],
        // tree: {}
      },
    ]
    
    for (let i = 0; i < folders.length; i++){
      const target = path+'/'+folders[i].name;
      await fs.mkdir(target, { recursive: true })
      const tree = dirTree(target, { exclude: /__MACOSX|.DS_Store/});
      // if(tree){
      //   folders[i].tree = tree
      // }
      // let files = await dir.files(target, {sync:true});
      // const modifiedFiles = files.map(name => name.replace(target,''));
      // if (files){
      folders[i].files = createFilesArray(tree,0)
      // }
    }

    res.json({
      result: folders
    })
  } catch(error) {
    throw error;
  }
}

async function handleDeleteHelperFiles(req: NextApiRequest, res: NextApiResponse) {
  try{  
    const {path, type} = req.query
    // console.log(JSON.parse(req.body))
    // clear old upload (may make it configurable later)
    if(type == "directory") {
      // @ts-ignore
      await fs.rmdir(path)
    }
    else {
      // @ts-ignore
      await fs.unlink(path)
    }
    res.json({message:'success'})
  }catch(error){
    throw error;
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`inside helper API, req is in type of ${req.method}`)
  try {
    switch(req.method?.toLowerCase()) {
      case 'get':
        return handleGetHelperFiles(req, res);
      case 'post':
        return handleAddHelperFiles(req, res);
      case 'delete':
        return handleDeleteHelperFiles(req, res);
      default:
        return res.status(400).send('bad request');
    }
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
}

export default withSentry(handler);

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false
  }
}
