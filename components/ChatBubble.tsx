type Props = {
  role: "nyanta" | "user";
  text: string;
};

export default function ChatBubble({ role, text }: Props) {
  if (role === "nyanta") {
    return (
      <div className="flex items-start gap-2 max-w-[85%]">
        <div className="flex-shrink-0 w-2" />
        <div className="bg-pink-50 border border-pink-200 rounded-2xl rounded-tl-sm px-4 py-3 text-slate-700 text-base leading-relaxed shadow-sm">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-end max-w-[85%] ml-auto">
      <div className="bg-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-base leading-relaxed shadow-sm">
        {text}
      </div>
    </div>
  );
}
