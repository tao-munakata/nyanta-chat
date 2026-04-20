import NyantaFace, {
  type CharacterVersion,
  type Expression,
} from "@/components/NyantaFace";

type Props = {
  role: "nyanta" | "user";
  text: string;
  expression?: Expression;
  version?: CharacterVersion;
};

export default function ChatBubble({
  role,
  text,
  expression = "welcome",
  version = "doctor",
}: Props) {
  if (role === "nyanta") {
    return (
      <div className="flex items-end gap-3 max-w-[90%]">
        {/* 猫イラスト */}
        <div className="flex-shrink-0 drop-shadow-sm">
          <NyantaFace
            expression={expression}
            version={version}
            size={64}
            speaking
          />
        </div>
        {/* 吹き出し */}
        <div className="relative bg-white border border-pink-200 rounded-2xl rounded-bl-sm px-4 py-3 text-slate-700 text-base leading-relaxed shadow-sm">
          {/* 吹き出しの尾（左下向き） */}
          <span className="absolute -left-2 bottom-3 w-0 h-0
            border-t-[8px] border-t-transparent
            border-r-[10px] border-r-white
            border-b-[0px]" />
          <span className="absolute -left-[11px] bottom-3 w-0 h-0
            border-t-[8px] border-t-transparent
            border-r-[10px] border-r-pink-200
            border-b-[0px]" />
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
