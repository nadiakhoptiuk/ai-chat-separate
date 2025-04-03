import { useLoaderData } from "@remix-run/react";
import Chat from "~/components/ui/modules/Chat";
import { Message, SystemMessage } from "~/types/chat";
import { io } from "socket.io-client";
import { useEffect , useState } from "react";
import type { Socket } from "socket.io-client";
import { mastraClient } from "~/lib/mastra";
import { loadDataFromUrl } from "~/services/dataLoaderFromUrl";
import { processTextIntoChunks } from "~/services/processDocsIntoChunks";
import { loadDataFromPDFWithPDF2JSON } from "~/services/dataLoadFromPDF";
import { extractImagesFromURL } from "~/services/extractImagesFromPDF";
export async function loader() {
  const threadId = "123";
  const resourceId = "user-1";



  const text = await loadDataFromUrl();
  const images = await extractImagesFromURL('https://www.npmjs.com/package/cheerio');
  const chunksFromUrl = await processTextIntoChunks(text);
  console.log('CHUNK 1 >>>>', chunksFromUrl[0]);

  const textFromPDF = await loadDataFromPDFWithPDF2JSON();
  const chunksFromPDF = await processTextIntoChunks(textFromPDF.text);
  console.log('CHUNK 2 >>>>', chunksFromPDF[0]);


  const existingThread = await mastraClient.getMemoryThread(threadId, 'weatherAgent');

  if (!existingThread) {
    await mastraClient.createMemoryThread({
      title: "Draft",
      threadId: threadId,
      resourceid: resourceId,
      agentId: 'weatherAgent',
      metadata: {
        category: "support", 
      }
    });

    return {
      messages: []
    };
  }
 
  const { uiMessages } = await existingThread.getMessages();

  // Convert and filter the messages to our app's Message format
  const filteredMessages = uiMessages.filter((msg: SystemMessage) => msg.content !== '' && (msg.role === 'assistant' || msg.role === 'user'));

  return {
    messages: filteredMessages as Message[]
  };
}

export default function IndexPage() {
  const { messages } = useLoaderData<typeof loader>();
  const id = "123";

  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socket = io();
    setSocket(socket);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("confirmation", (data) => {
      console.log('socket confirmation,', data);
    });
  }, [socket]);


  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col">
        <Chat
          chatId={id}
          messages={messages || []}
          socket={socket}
        />
      </div>
    </div>
  );
} 