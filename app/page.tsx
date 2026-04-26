import Link from "next/link";
import NyantaFace from "@/components/NyantaFace";
import { SERVICE_LIST } from "@/lib/services";
import { APP_VERSION } from "@/lib/version";

export default function ServiceHomePage() {
  return (
    <div className="min-h-screen bg-slate-50 max-w-lg mx-auto">
      <header className="border-b border-slate-200 bg-white px-4 py-5">
        <div className="flex items-center gap-3">
          <NyantaFace expression="happy" version="pink" size={64} />
          <div>
            <p className="text-[11px] font-bold uppercase text-pink-400">
              Nyanta Services
            </p>
            <h1 className="text-xl font-bold text-slate-800">
              にゃん太チャット
            </h1>
            <p className="mt-1 text-xs font-semibold text-slate-400">
              {APP_VERSION}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          目的に合わせて、にゃん太の会話テーマを切り替えられます。
          まずは同じVPSで動作確認し、あとからサービスごとに切り出せる構成です。
        </p>
      </header>

      <main className="grid gap-3 p-4">
        {SERVICE_LIST.map((service) => (
          <Link
            key={service.id}
            href={service.slug}
            className={`rounded-2xl border ${service.borderClass} bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
          >
            <div className="flex items-center gap-3">
              <NyantaFace
                expression={service.expression}
                version={service.character}
                size={52}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className={`text-[11px] font-bold uppercase ${service.textClass}`}>
                      {service.themeLabel}
                    </p>
                    <h2 className={`text-base font-bold ${service.textClass}`}>
                      {service.name}
                    </h2>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold text-white ${service.buttonClass}`}>
                    {service.entryLabel}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {service.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}
