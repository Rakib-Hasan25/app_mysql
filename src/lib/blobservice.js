import { BlobServiceClient, BaseRequestPolicy, newPipeline, AnonymousCredential } from "@azure/storage-blob";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();
const account = process.env.ACCOUNT_NAME || "";
const SAS = process.env.SAS_TOKEN || "";


// Create a policy factory with create() method provided
class RequestIDPolicyFactory {
  // Constructor to accept parameters
  constructor(prefix) {
    this.prefix = prefix;
  }

  // create() method needs to create a new RequestIDPolicy object
  create(nextPolicy, options) {
    return new RequestIDPolicy(nextPolicy, options, this.prefix);
  }
}

// Create a policy by extending from BaseRequestPolicy
class RequestIDPolicy extends BaseRequestPolicy {
  constructor(nextPolicy, options, prefix) {
    super(nextPolicy, options);
    this.prefix = prefix;
  }

  // Customize HTTP requests and responses by overriding sendRequest
  // Parameter request is WebResource type
  async sendRequest(request) {
    // Customize client request ID header
    request.headers.set(
      "x-ms-version",
      `2020-02-10`
    );

    // response is HttpOperationResponse type
    const response = await this._nextPolicy.sendRequest(request);

    // Modify response here if needed

    return response;
  }
}

const pipeline = newPipeline(new AnonymousCredential());

// Inject customized factory into default pipeline
pipeline.factories.unshift(new RequestIDPolicyFactory("Prefix"));

  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net${SAS}`,
    pipeline
  );


  const getcontainers = async (req,res)=>{
    let i = 1;
  const constainers = [];
  try {
    for await (const container of blobServiceClient.listContainers()) {
      console.log(`Container ${i++}: ${container.name}`);
      console.log(container);
      constainers.push(container.name)
    }
  }catch(err) {
    console.error("err:::", err);
  }
  res.json(constainers);
}

const uploadingBlob = async (req,res)=>{
    const containerName = req.body.containerName
  const content = req.body.content
  const containerClient = blobServiceClient.getContainerClient(containerName);
  let requestId = '';
  let name = '';
  try{
    const blobName = "conatiner1blob";
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadBlobResponse = await blockBlobClient.upload(content, content.length);
    console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
    requestId = uploadBlobResponse.requestId;
    name = blobName;
  }catch(err) {
    console.error("err:::", err);
  }
  res.json({requestId, blobName: name});
}

const readBlob = async (req, res) => {
    const containerName = req.params.containerName
    const blobName = req.params.blobName
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
  
    // Get blob content from position 0 to the end
    // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
    const downloadBlockBlobResponse = await blobClient.download();
    const downloaded = (
      await streamToBuffer(downloadBlockBlobResponse.readableStreamBody)
    ).toString();
    console.log("Downloaded blob content:", downloaded);
  
    async function streamToBuffer(readableStream) {
      return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
          chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on("end", () => {
          resolve(Buffer.concat(chunks));
        });
        readableStream.on("error", reject);
      });
    }
    res.json({content: downloaded});
}



const uploadfiles = async (req,res) => {
    const containerName = "rakibcontainer"
   
    const containerClient = blobServiceClient.getContainerClient(containerName);
    let requestId = '';
    let name = '';
    try{
      const blobName = "conatiner9blob";
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      
      const fileStream = fs.createReadStream(req.file.path);
      const fileMimeType = req.file.mimetype;
       await blockBlobClient.uploadStream(fileStream, undefined, undefined, {
        blobHTTPHeaders: { blobContentType: fileMimeType }
      });

    //   const uploadBlobResponse = await blockBlobClient.upload(content, content.length);
      
    // const blobUrl = blockBlobClient.url;
     
      
      
    //   console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
    //   requestId = uploadBlobResponse.requestId;
     
    res.json({msg:"successfully uploaded fille",bloburl: blockBlobClient.url});
    }catch(err) {
      console.error("err:::", err);
    }

}
export{getcontainers,uploadingBlob,readBlob,uploadfiles }