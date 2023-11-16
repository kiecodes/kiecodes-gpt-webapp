import Markdown from 'react-markdown'
import { SiOpenai } from "react-icons/si";
import remarkGfm from "remark-gfm";

export default function ChatMessage({message, role}) {

    const roleIcon = role === "user"
        ? <div className="rounded-full h-8 w-8 bg-slate-600 flex items-center justify-center font-semibold text-slate-300 shrink-0">C</div>
        : <div className="rounded-full h-8 w-8 bg-pink-600 flex items-center justify-center font-semibold text-slate-50 shrink-0"><SiOpenai /></div>

    const roleName = role === "user"
        ? "Coder"
        : "KieCodesGPT"

    return (
        <div className="flex flex-row mx-2 my-4">
            {roleIcon}
            <div className="p-1 ml-2">
                <div className="flex-col">
                    <p className="font-semibold text-slate-400">{roleName}</p>
                    <Markdown
                        className="text-slate-50 markdown"
                        remarkPlugins={[remarkGfm]}
                    >
                        {message}
                    </Markdown>
                </div>
            </div>
        </div>
    )
}