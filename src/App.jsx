import {
  FaGithub, FaLinkedin, FaFacebook, FaYoutube, FaEnvelope,
  FaPython, FaJava, FaReact, FaNodeJs, FaDocker,
  FaDatabase, FaGitAlt, FaServer, FaCode, FaCubes
} from "react-icons/fa";

import {
  SiTailwindcss, SiJavascript,
  SiMysql, SiPandas, SiApachespark
} from "react-icons/si";




import { useEffect, useMemo, useRef, useState } from "react";
import { PROJECTS } from "./data/projects";
import { SKILL_GROUPS } from "./data/skills";
import { PROFILE } from "./data/profile";

function cn(...xs) {
  return xs.filter(Boolean).join(" ");
}

/* ---------------------------
   Motion helpers
--------------------------- */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  return reduced;
}

function useTypewriter(text, { speed = 28, startDelay = 120 } = {}) {
  const [out, setOut] = useState("");

  useEffect(() => {
    setOut("");
    let i = 0;
    let intervalId = null;

    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        i += 1;
        setOut(text.slice(0, i));
        if (i >= text.length) {
          window.clearInterval(intervalId);
          intervalId = null;
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return out;
}

function TypewriterText({ text, className, speed, startDelay, showCursor = true }) {
  const reduced = usePrefersReducedMotion();
  const typed = reduced ? text : useTypewriter(text, { speed, startDelay });
  const done = typed.length >= text.length;

  return (
    <span className={className}>
      {typed}
      {!reduced && showCursor && !done ? (
        <span className="ml-0.5 inline-block w-[0.6ch] animate-pulse">|</span>
      ) : null}
    </span>
  );
}

function Reveal({ children, className, delay = 0 }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        shown ? "opacity-100 translate-y-0 blur-0" : "opacity-0 translate-y-6 blur-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ---------------------------
   UI atoms
--------------------------- */
function Button({ as = "button", className, ...props }) {
  const Comp = as;
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm",
        className
      )}
      {...props}
    />
  );
}

function Card({ children, className }) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5 shadow-sm",
        // hover effect
        "transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}


function Chip({ children, className, icon: Icon }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
        className
      )}
    >
      {Icon ? <Icon className="text-[14px]" /> : null}
      <span>{children}</span>
    </span>
  );
}


function Section({ id, title, children }) {
  return (
    <section id={id} className="scroll-mt-24 py-12">
      <div className="mx-auto w-full max-w-6xl px-4">
        <Reveal>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          </div>
          {children}
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------
   App
--------------------------- */
export default function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "vi");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [q, setQ] = useState("");
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => localStorage.setItem("lang", lang), [lang]);
  useEffect(() => localStorage.setItem("theme", theme), [theme]);
  useEffect(() => {
  const onScroll = () => {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || doc.scrollTop || 0;
    const scrollHeight = doc.scrollHeight || 0;
    const clientHeight = doc.clientHeight || 0;
    const denom = Math.max(1, scrollHeight - clientHeight);
    const pct = Math.min(1, Math.max(0, scrollTop / denom));
    setScrollPct(pct);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  return () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
  };
}, []);

  const isDark = theme === "dark";
  const ICON_BY_LABEL = {
  // Skills
  Python: FaPython,
  Java: FaJava,
  JavaScript: SiJavascript,
  SQL: FaDatabase,
  "T-SQL": FaDatabase,
  "C#": FaCode,
  React: FaReact,
  Tailwind: SiTailwindcss,
  "Node.js": FaNodeJs,
  Docker: FaDocker,
  "Git/GitHub": FaGitAlt,
  "Data Structures": FaCode,
  OOP: FaCubes,
  "REST API": FaServer,
  "Client/Server": FaServer,
  PySpark: SiApachespark,
  Pandas: SiPandas,
};

  const ui = useMemo(() => {
    const page = isDark ? "bg-zinc-950 text-white" : "bg-white text-zinc-900";
    const nav = isDark ? "border-white/10 bg-zinc-950/70" : "border-zinc-200 bg-white/70";
    const muted = isDark ? "text-white/85" : "text-zinc-800";
    const linkMuted = isDark ? "text-white/70 hover:text-white" : "text-zinc-700 hover:text-zinc-900";
    const card  = isDark
  ? "border-white/10 bg-white/5"
  : "border-zinc-200 bg-white";
    const chip  = isDark
  ? "border-white/10 bg-white/5 text-white/85"
  : "border-zinc-300 bg-zinc-100 text-zinc-800";
    const badge = isDark
  ? "border-white/10 bg-white/5 text-white/80"
  : "border-zinc-300 bg-zinc-100 text-zinc-700";
 const input = isDark
  ? "border-white/10 bg-white/5 text-white placeholder:text-white/40"
  : "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-500";
;
    const btn = isDark
      ? "border-white/10 bg-white/5 text-white/90 hover:bg-white/10"
      : "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50";
    const btnPrimary = isDark
      ? "border-sky-400/30 bg-sky-400/10 text-white hover:bg-sky-400/15"
      : "border-sky-500/30 bg-sky-500/10 text-sky-900 hover:bg-sky-500/15";
    const footer = isDark ? "border-white/10 text-white/50" : "border-zinc-200 text-zinc-500";
    const imgBorder = isDark ? "border-white/10" : "border-zinc-200";
    return { page, nav, muted, linkMuted, card, chip, badge, input, btn, btnPrimary, footer, imgBorder };
  }, [isDark]);

  const dict = useMemo(
    () => ({
      vi: {
        about: "Giới thiệu",
        skills: "Kỹ năng",
        projects: "Dự án",
        cv: "CV",
        contact: "Liên hệ",
        viewProjects: "Xem dự án",
        contactMe: "Liên hệ mình",
        searchProjects: "Tìm dự án...",
        projectsHint: "Toàn bộ dự án học tập và phát triển cụ thể nằm trong Github",
        openCV: "Mở CV (PDF)",
        reachMe: "Thông tin liên hệ",
        sendMsg: "Gửi tin nhắn",
        sendViaEmail: "Gửi qua Email",
        formNote: "Form dùng mailto nên không cần backend.",
        quickLinks: "Link nhanh",
        backToTop: "Lên đầu trang",
      },
      en: {
        about: "About",
        skills: "Skills",
        projects: "Projects",
        cv: "CV",
        contact: "Contact",
        viewProjects: "View Projects",
        contactMe: "Contact Me",
        searchProjects: "Search projects...",
        projectsHint: "2–3 lines + tech stack + GitHub/demo links.",
        openCV: "Open CV (PDF)",
        reachMe: "Reach me",
        sendMsg: "Send a message",
        sendViaEmail: "Send via Email",
        formNote: "Uses mailto, no backend needed.",
        quickLinks: "Quick links",
        backToTop: "Back to top",
      },
    }),
    []
  );
  const [copied, setCopied] = useState(false);

const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  } catch {
    window.location.href = `mailto:${PROFILE.email}`;
  }
};

  const t = (k) => dict[lang][k] ?? k;

  const filteredProjects = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return PROJECTS;
    return PROJECTS.filter((p) =>
      (p.title + " " + p.desc[lang] + " " + p.stack.join(" ")).toLowerCase().includes(s)
    );
  }, [q, lang]);

  const mailto = (subject, message) => {
    const url = `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.location.href = url;
  };

  return (
    <div className={cn("min-h-screen", ui.page)}>
      {/* NAV */}
      <header className={cn("sticky top-0 z-50 border-b backdrop-blur", ui.nav)}>
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <a href="#top" className="font-semibold tracking-tight">
            {PROFILE.name}
          </a>

          <nav className={cn("hidden items-center gap-5 text-sm md:flex", ui.muted)}>
            <a className={ui.linkMuted} href="#about">{t("about")}</a>
            <a className={ui.linkMuted} href="#skills">{t("skills")}</a>
            <a className={ui.linkMuted} href="#projects">{t("projects")}</a>
            <a className={ui.linkMuted} href="#cv">{t("cv")}</a>
            <a className={ui.linkMuted} href="#contact">{t("contact")}</a>
          </nav>

          <div className="flex items-center gap-2">
            <Button className={ui.btn} type="button" onClick={() => setLang((v) => (v === "vi" ? "en" : "vi"))}>
              {lang.toUpperCase()}
            </Button>
            <Button className={ui.btn} type="button" onClick={() => setTheme((v) => (v === "dark" ? "light" : "dark"))}>
              {isDark ? "Dark" : "Light"}
            </Button>
            <Button as="a" className={ui.btn} href={PROFILE.github} target="_blank" rel="noreferrer">
              GitHub
            </Button>
            <Button as="a" className={ui.btnPrimary} href={PROFILE.cvPath} target="_blank" rel="noreferrer">
              CV PDF
            </Button>
          </div>
        </div>
        <div className={cn("h-[3px] w-full", isDark ? "bg-white/10" : "bg-zinc-200")}>
  <div
    className="h-full bg-sky-500 transition-[width] duration-150"
    style={{ width: `${Math.round(scrollPct * 100)}%` }}
  />
</div>

      </header>

      {/* HERO */}
      <main id="top">
        <div className="mx-auto w-full max-w-6xl px-4 pt-12">
          <div className="grid gap-6 md:grid-cols-5">
            <div className="md:col-span-3">
              <div className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs", ui.chip)}>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {PROFILE.role[lang]}
              </div>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                <TypewriterText text={PROFILE.name} speed={26} startDelay={120} showCursor />
              </h1>

              <p className={cn("mt-3 max-w-2xl text-base leading-relaxed", ui.muted)}>
                <TypewriterText
                  key={`tagline-${lang}`}
                  text={PROFILE.tagline[lang]}
                  speed={18}
                  startDelay={420}
                  showCursor={false}
                />
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <Button as="a" className={ui.btnPrimary} href="#projects">
                  {t("viewProjects")}
                </Button>
                <Button
                  className={ui.btn}
                  type="button"
                  onClick={() =>
                    mailto(
                      "Hello!",
                      lang === "vi"
                        ? "Hello, Chao Anh, Chi muon lien he ve voi em ..."
                        : "Hello, I would like to get in touch regarding ..."
                    )
                  }
                >
                  {t("contactMe")}
                </Button>
               <Button as="a" className={ui.btn} href={PROFILE.github} target="_blank" rel="noreferrer">
    <FaGithub className="text-base" />
    GitHub
  </Button>

  <Button as="a" className={ui.btn} href={PROFILE.linkedin} target="_blank" rel="noreferrer">
    <FaLinkedin className="text-base" />
    LinkedIn
  </Button>

  {PROFILE.facebook ? (
    <Button as="a" className={ui.btn} href={PROFILE.facebook} target="_blank" rel="noreferrer">
      <FaFacebook className="text-base" />
      Facebook
    </Button>
  ) : null}

  {PROFILE.youtube ? (
    <Button as="a" className={ui.btn} href={PROFILE.youtube} target="_blank" rel="noreferrer">
      <FaYoutube className="text-base" />
      YouTube
    </Button>
  ) : null}

  <Button as="a" className={ui.btn} href={`mailto:${PROFILE.email}`}>
    <FaEnvelope className="text-base" />
    Email
  </Button>
        </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Chip className={ui.chip}>React</Chip>
                <Chip className={ui.chip}>Tailwind</Chip>
                <Chip className={ui.chip}>Node.js</Chip>
                <Chip className={ui.chip}>Python</Chip>
                <Chip className={ui.chip}>Docker</Chip>
              </div>
            </div>

            <div className="md:col-span-2">
              <Card className={ui.card}>
                <div className="flex items-center gap-4">
                  <img
                    src={PROFILE.avatar}
                    alt="Avatar"
                    className={cn("h-16 w-16 rounded-2xl border object-cover", ui.imgBorder)}
                  />
                  <div className="min-w-0">
                    <div className="font-semibold leading-tight">{PROFILE.name}</div>
                    <div className={cn("text-sm", ui.muted)}>{PROFILE.role[lang]}</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className={cn("rounded-xl border p-4 text-center", ui.card)}>
                    <div className="text-xl font-semibold">{PROJECTS.length}</div>
                    <div className={cn("text-xs", ui.muted)}>Projects</div>
                  </div>
                  <div className={cn("rounded-xl border p-4 text-center", ui.card)}>
                    <div className="text-xl font-semibold">CV</div>
                    <div className={cn("text-xs", ui.muted)}>PDF</div>
                  </div>
                  <div className={cn("rounded-xl border p-4 text-center", ui.card)}>
                    <div className="text-xl font-semibold">Open</div>
                    <div className={cn("text-xs", ui.muted)}>Internships</div>
                  </div>
                </div>

                <div className={cn("mt-4 rounded-xl border p-4", ui.card)}>
                  <div className="text-sm font-medium">{t("quickLinks")}</div>
                  <div className={cn("mt-2 grid gap-2 text-sm", ui.muted)}>
  <a
    className={cn("flex items-center gap-2", ui.linkMuted)}
    href={PROFILE.github}
    target="_blank"
    rel="noreferrer"
  >
    <FaGithub className="text-base" />
    <span className="truncate">{PROFILE.github}</span>
  </a>

  <a
    className={cn("flex items-center gap-2", ui.linkMuted)}
    href={PROFILE.linkedin}
    target="_blank"
    rel="noreferrer"
  >
    <FaLinkedin className="text-base" />
    <span className="truncate">{PROFILE.linkedin}</span>
  </a>

  {PROFILE.facebook ? (
    <a
      className={cn("flex items-center gap-2", ui.linkMuted)}
      href={PROFILE.facebook}
      target="_blank"
      rel="noreferrer"
    >
      <FaFacebook className="text-base" />
      <span className="truncate">{PROFILE.facebook}</span>
    </a>
  ) : null}

  {PROFILE.youtube ? (
    <a
      className={cn("flex items-center gap-2", ui.linkMuted)}
      href={PROFILE.youtube}
      target="_blank"
      rel="noreferrer"
    >
      <FaYoutube className="text-base" />
      <span className="truncate">{PROFILE.youtube}</span>
    </a>
  ) : null}

  <div className="flex items-center justify-between gap-2">
    <a
      className={cn("flex min-w-0 items-center gap-2", ui.linkMuted)}
      href={`mailto:${PROFILE.email}`}
    >
      <FaEnvelope className="text-base shrink-0" />
      <span className="truncate">{PROFILE.email}</span>
    </a>

    <Button
      type="button"
      className={cn(
        "shrink-0 px-3 py-1.5 text-xs",
        isDark
          ? "border-white/10 bg-white/5 hover:bg-white/10"
          : "border-zinc-300 bg-white hover:bg-zinc-50"
      )}
      onClick={() => copyToClipboard(PROFILE.email)}
    >
      {copied ? (lang === "vi" ? "Đã copy" : "Copied") : "Copy"}
    </Button>
  </div>
</div>

                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* ABOUT */}
        <Section id="about" title={t("about")}>
          <div className="grid gap-4 md:grid-cols-2">
            <Reveal delay={0}>
              <Card className={ui.card}>
                <h3 className="text-sm font-semibold">Summary</h3>
                <p className={cn("mt-2 text-sm leading-relaxed", ui.muted)}>
                  {lang === "vi"
                    ? "Là sinh viên năm cuối chuyên ngành Khoa học Máy tính tại Đại học Tôn Đức Thắng với GPA 8.12/10 , tôi có nền tảng vững chắc về lập trình với Java, Python, Node.js và React. Bên cạnh kiến thức về cấu trúc dữ liệu và OOP, tôi có khả năng sử dụng Docker và ứng dụng AI linh hoạt để tối ưu hóa công việc. Với tư duy giải quyết vấn đề và kỹ năng làm việc nhóm tốt , tôi mong muốn ứng tuyển vị trí Thực tập sinh Software Engineer để đóng góp vào các dự án thực tế và phát triển bản thân trong môi trường chuyên nghiệp."
                    : "As a final-year Computer Science student at Ton Duc Thang University with a GPA of 8.12/10 , I possess a solid foundation in Java, Python, Node.js, and React. Beyond core algorithms and OOP, I am proficient in using Docker and leveraging AI tools to enhance development efficiency. Equipped with strong problem-solving and teamwork skills , I am seeking a Software Engineer Internship to apply my technical expertise to real-world products and grow within a professional environment."}
                </p>
              </Card>
            </Reveal>

            <Reveal delay={120}>
              <Card className={ui.card}>
                <h3 className="text-sm font-semibold">Highlights</h3>
                <ul className={cn("mt-2 list-disc pl-5 text-sm leading-relaxed", ui.muted)}>
                  <li>{lang === "vi" ? "Ưu tiên dự án chạy được, README rõ." : "Prefer runnable projects with clear READMEs."}</li>
                  <li>{lang === "vi" ? "Biết đo lường kết quả và tối ưu." : "Measure outcomes and iterate to improve."}</li>
                  <li>{lang === "vi" ? "Làm việc nhóm: chia task, review, chuẩn hoá code." : "Teamwork: task split, review, code consistency."}</li>
                </ul>
              </Card>
            </Reveal>
          </div>
        </Section>

        {/* SKILLS */}
        <Section id="skills" title={t("skills")}>
          <div className="grid gap-4 md:grid-cols-2">
            {SKILL_GROUPS.map((g, i) => (
              <Reveal key={g.title.en} delay={i * 90}>
                <Card className={ui.card}>
                  <h3 className="text-sm font-semibold">{g.title[lang]}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {g.items.map((it) => {
                    const Icon = ICON_BY_LABEL[it];
                    return (
                      <Chip key={it} className={ui.chip} icon={Icon}>
                        {it}
                      </Chip>
                    );
                  })}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* PROJECTS */}
        <Section id="projects" title={t("projects")}>
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className={cn("text-sm", ui.muted)}>{t("projectsHint")}</p>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("searchProjects")}
              className={cn("w-full rounded-xl border px-4 py-2 text-sm md:w-80", ui.input)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {filteredProjects.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <Card className={ui.card}>
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      className={cn("mb-3 h-40 w-full rounded-xl border object-cover", ui.imgBorder)}
                    />
                  ) : null}

                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold">{p.title}</h3>
                    <span className={cn("rounded-full border px-2 py-1 text-xs", ui.badge)}>
                      {p.status[lang]}
                    </span>
                  </div>

                  <div className={cn("mt-1 text-xs", ui.muted)}>
                    {p.role?.[lang]} • {p.period}
                  </div>

                  <p className={cn("mt-2 text-sm leading-relaxed", ui.muted)}>
                    {p.desc[lang]}
                  </p>

                  {p.highlights?.[lang]?.length ? (
                    <ul className={cn("mt-3 list-disc pl-5 text-sm leading-relaxed", ui.muted)}>
                      {p.highlights[lang].map((x) => <li key={x}>{x}</li>)}
                    </ul>
                  ) : null}

                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.stack.map((s) => {
                      const Icon = ICON_BY_LABEL[s] || ICON_BY_LABEL[
                        s.replace(/\s*\(.*\)\s*/g, "")
                      ];
                      return (
                        <Chip key={s} className={ui.chip} icon={Icon}>
                          {s}
                        </Chip>
                      );
                    })}

                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.github ? (
                      <Button as="a" className={ui.btn} href={p.github} target="_blank" rel="noreferrer">
                        GitHub
                      </Button>
                    ) : null}
                    {p.demo ? (
                      <Button as="a" className={ui.btn} href={p.demo} target="_blank" rel="noreferrer">
                        Demo
                      </Button>
                    ) : null}
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* CV */}
        <Section id="cv" title={t("cv")}>
          <Card className={ui.card}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                {/* <p className={cn("text-sm", ui.muted)}>
                  {lang === "vi" ? "CV đặt tại public/CV.pdf." : "CV is located at public/CV.pdf."}
                </p> */}
                <p className={cn("mt-1 text-sm", ui.muted)}>
                  {lang === "vi" ? "Nút kế bên sẽ mở CV trên tab mới." : "The button below opens the PDF in a new tab."}
                </p>
              </div>
              <Button as="a" className={ui.btnPrimary} href={PROFILE.cvPath} target="_blank" rel="noreferrer">
                {t("openCV")}
              </Button>
            </div>
          </Card>
        </Section>

        {/* CONTACT */}
        <Section id="contact" title={t("contact")}>
          <div className="grid gap-4 md:grid-cols-2">
            <Reveal delay={0}>
              <Card className={ui.card}>
                <h3 className="text-sm font-semibold">{t("reachMe")}</h3>
                <div className={cn("mt-3 grid gap-2 text-sm", ui.muted)}>
                  <a className={ui.linkMuted} href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
                  <a className={ui.linkMuted} href={PROFILE.github} target="_blank" rel="noreferrer">{PROFILE.github}</a>
                  <a className={ui.linkMuted} href={PROFILE.linkedin} target="_blank" rel="noreferrer">{PROFILE.linkedin}</a>
                </div>
              </Card>
            </Reveal>

            <Reveal delay={120}>
              <Card className={ui.card}>
                <h3 className="text-sm font-semibold">{t("sendMsg")}</h3>
                <form
                  className="mt-3 grid gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    const name = fd.get("name");
                    const email = fd.get("email");
                    const subject = fd.get("subject");
                    const message = fd.get("message");
                    mailto(subject, `From: ${name} <${email}>\n\n${message}`);
                  }}
                >
                  <input
                    name="name"
                    required
                    placeholder={lang === "vi" ? "Tên của bạn" : "Your name"}
                    className={cn("rounded-xl border px-4 py-2 text-sm", ui.input)}
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder={lang === "vi" ? "Email của bạn" : "Your email"}
                    className={cn("rounded-xl border px-4 py-2 text-sm", ui.input)}
                  />
                  <input
                    name="subject"
                    required
                    placeholder={lang === "vi" ? "Tiêu đề" : "Subject"}
                    className={cn("rounded-xl border px-4 py-2 text-sm", ui.input)}
                  />
                  <textarea
                    name="message"
                    rows="4"
                    required
                    placeholder={lang === "vi" ? "Nội dung" : "Message"}
                    className={cn("rounded-xl border px-4 py-2 text-sm", ui.input)}
                  />
                  <Button type="submit" className={ui.btnPrimary}>
                    {t("sendViaEmail")}
                  </Button>
                  <p className={cn("text-xs", ui.muted)}>{t("formNote")}</p>
                </form>
              </Card>
            </Reveal>
          </div>
        </Section>

        <footer className={cn("border-t py-8", ui.footer)}>
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 text-sm">
            <span>© {new Date().getFullYear()} {PROFILE.name}</span>
            <a className={ui.linkMuted} href="#top">{t("backToTop")}</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
