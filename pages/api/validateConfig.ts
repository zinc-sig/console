import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
const PROTO_PATH = 'proto/Zinc.proto';
const target = 'fakegrader:50051';

function genGRPCClient(){
  var packageDefinition = loadSync(
      PROTO_PATH,
      {keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
      });
  var protoDescriptor = loadPackageDefinition(packageDefinition)
  var zinc_proto = protoDescriptor.Zinc;
  //@ts-ignore
  var client = new zinc_proto(target,credentials.createInsecure());
  return client
}

export default async function (req:  NextApiRequest, res: NextApiResponse) { 
    const client = genGRPCClient()
    client.validateConfig(JSON.parse(req.body), function(err:any ,valid: boolean){
        if (err) {
          console.log(err)
          res.json({status:"fail", configError:err})
        }
        if(!valid){
            res.json({status:"success", configError:"invalid yaml"})
        }else{
            res.json({status:"success"})        
        }
    })
}

export const config = {
  api: {
    externalResolver: true
  }
}