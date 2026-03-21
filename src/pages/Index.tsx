import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const NAV_ITEMS = [
  { id: "dashboard", label: "Дашборд", icon: "LayoutDashboard" },
  { id: "tasks", label: "Задачи", icon: "CheckSquare" },
  { id: "workflows", label: "Процессы", icon: "GitBranch" },
  { id: "reports", label: "Отчёты", icon: "BarChart3" },
  { id: "integrations", label: "Интеграции", icon: "Plug" },
  { id: "users", label: "Пользователи", icon: "Users" },
];

const KPI_DATA = [
  { label: "Активных задач", value: 148, delta: "+12%", icon: "CheckSquare", color: "var(--neon-green)" },
  { label: "Завершено сегодня", value: 34, delta: "+8%", icon: "TrendingUp", color: "var(--neon-blue)" },
  { label: "Клиентов в CRM", value: 2840, delta: "+3%", icon: "Users", color: "var(--neon-purple)" },
  { label: "Автоматизаций", value: 17, delta: "+2", icon: "Zap", color: "var(--neon-orange)" },
];

const TASKS = [
  { id: 1, title: "Подготовить коммерческое предложение", project: "Продажи", priority: "high", status: "В работе", assignee: "АК", due: "21 мар" },
  { id: 2, title: "Обновить базу клиентов в CRM", project: "CRM", priority: "medium", status: "Ожидает", assignee: "МП", due: "22 мар" },
  { id: 3, title: "Провести онбординг нового сотрудника", project: "HR", priority: "low", status: "Готово", assignee: "ЕС", due: "20 мар" },
  { id: 4, title: "Аудит рекламных кампаний", project: "Маркетинг", priority: "high", status: "В работе", assignee: "ДР", due: "23 мар" },
  { id: 5, title: "Сформировать отчёт за квартал", project: "Финансы", priority: "medium", status: "Ожидает", assignee: "ИВ", due: "25 мар" },
];

const WORKFLOWS = [
  { id: 1, name: "Обработка входящих лидов", trigger: "Новый лид в CRM", steps: 4, status: "active", runs: 128 },
  { id: 2, name: "Ежедневный дайджест команде", trigger: "Каждый день в 09:00", steps: 2, status: "active", runs: 31 },
  { id: 3, name: "Эскалация просроченных задач", trigger: "Задача просрочена", steps: 3, status: "paused", runs: 14 },
  { id: 4, name: "Синхронизация клиентов", trigger: "Обновление в CRM", steps: 5, status: "active", runs: 540 },
];

const CRM_CONTACTS = [
  { name: "Алексей Петров", company: "ООО Техно", status: "Клиент", lastSync: "5 мин назад", avatar: "АП" },
  { name: "Мария Иванова", company: "Группа Инвест", status: "Лид", lastSync: "12 мин назад", avatar: "МИ" },
  { name: "Сергей Волков", company: "СтройМаш", status: "Переговоры", lastSync: "1 ч назад", avatar: "СВ" },
  { name: "Наталья Сидорова", company: "ФудТрейд", status: "Клиент", lastSync: "2 ч назад", avatar: "НС" },
];

const CHART_DATA = [65, 80, 55, 90, 70, 95, 75, 88, 60, 92, 78, 85];
const CHART_MONTHS = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const duration = 1200;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return <span>{count.toLocaleString("ru-RU")}</span>;
}

function MiniChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 200;
    const y = 40 - (v / max) * 36;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 200 44" className="w-full h-12" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--neon-green)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--neon-green)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,44 ${points} 200,44`} fill="url(#chartGrad)" />
      <polyline
        points={points}
        fill="none"
        stroke="var(--neon-green)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const priorityStyles: Record<string, string> = {
    high: "text-red-400 bg-red-400/10",
    medium: "text-yellow-400 bg-yellow-400/10",
    low: "text-green-400 bg-green-400/10",
  };

  const priorityLabels: Record<string, string> = {
    high: "Высокий",
    medium: "Средний",
    low: "Низкий",
  };

  const statusStyles: Record<string, string> = {
    "В работе": "text-blue-400 bg-blue-400/10",
    "Ожидает": "text-yellow-400 bg-yellow-400/10",
    "Готово": "text-green-400 bg-green-400/10",
  };

  return (
    <div className="flex h-screen bg-mesh overflow-hidden font-golos">

      {/* Sidebar */}
      <aside className={`flex flex-col transition-all duration-300 ${sidebarOpen ? "w-60" : "w-16"} glass border-r border-white/5 z-20 shrink-0`}>
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "linear-gradient(135deg, var(--neon-green), var(--neon-blue))" }}>
            <Icon name="Zap" size={16} className="text-black" />
          </div>
          {sidebarOpen && (
            <div className="animate-fade-in overflow-hidden">
              <div className="font-oswald text-sm font-bold tracking-wider text-white leading-tight">БИЗНЕС</div>
              <div className="text-[10px] text-muted-foreground tracking-widest uppercase">Автоматизация</div>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                activeSection === item.id
                  ? "text-black font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
              style={activeSection === item.id ? {
                background: "linear-gradient(135deg, var(--neon-green), var(--neon-blue))",
              } : {}}
            >
              <Icon
                name={item.icon}
                size={18}
                className={`shrink-0 ${activeSection === item.id ? "text-black" : "group-hover:text-foreground"}`}
              />
              {sidebarOpen && (
                <span className="text-sm truncate">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="m-3 p-2 rounded-lg glass glass-hover flex items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Icon name={sidebarOpen ? "PanelLeftClose" : "PanelLeftOpen"} size={16} />
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="glass border-b border-white/5 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div>
            <h1 className="font-oswald text-xl font-semibold tracking-wide text-white">
              {NAV_ITEMS.find(n => n.id === activeSection)?.label}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">21 марта 2026 · Пятница</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground w-48 focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="Поиск..."
              />
              <Icon name="Search" size={14} className="absolute right-3 top-2 text-muted-foreground" />
            </div>
            <button className="relative p-2 glass glass-hover rounded-lg text-muted-foreground hover:text-foreground">
              <Icon name="Bell" size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black"
              style={{ background: "linear-gradient(135deg, var(--neon-green), var(--neon-blue))" }}>
              АД
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">

          {/* DASHBOARD */}
          {activeSection === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {KPI_DATA.map((kpi, i) => (
                  <div key={i} className="glass glass-hover rounded-xl p-4 cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background: `${kpi.color}18`, border: `1px solid ${kpi.color}30` }}>
                        <Icon name={kpi.icon} size={17} style={{ color: kpi.color }} />
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ color: kpi.color, background: `${kpi.color}15` }}>
                        {kpi.delta}
                      </span>
                    </div>
                    <div className="font-oswald text-3xl font-bold text-white mb-0.5">
                      <AnimatedCounter target={kpi.value} />
                    </div>
                    <div className="text-xs text-muted-foreground">{kpi.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 glass rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-oswald text-base font-semibold text-white">Активность по месяцам</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Завершённые задачи за год</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-md glass neon-text font-medium">2025–2026</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-32">
                    {CHART_DATA.map((val, i) => {
                      const max = Math.max(...CHART_DATA);
                      const height = (val / max) * 100;
                      const isLast = i === CHART_DATA.length - 1;
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                          <div
                            className="w-full rounded-t-sm transition-all duration-300 cursor-pointer"
                            style={{
                              height: `${height}%`,
                              background: isLast
                                ? "linear-gradient(180deg, var(--neon-green), var(--neon-blue))"
                                : "rgba(0,229,176,0.25)",
                              opacity: isLast ? 1 : 0.6,
                            }}
                          />
                          <span className="text-[9px] text-muted-foreground">{CHART_MONTHS[i]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="glass rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-oswald text-base font-semibold text-white">CRM · Синхронизация</h3>
                    <span className="flex items-center gap-1.5 text-xs text-primary">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
                      Онлайн
                    </span>
                  </div>
                  <div className="space-y-3">
                    {CRM_CONTACTS.map((c, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-black shrink-0"
                          style={{ background: "linear-gradient(135deg, var(--neon-purple), var(--neon-blue))" }}>
                          {c.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{c.name}</div>
                          <div className="text-[11px] text-muted-foreground truncate">{c.company}</div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[10px] font-medium"
                            style={{ color: c.status === "Клиент" ? "var(--neon-green)" : c.status === "Лид" ? "var(--neon-orange)" : "var(--neon-blue)" }}>
                            {c.status}
                          </div>
                          <div className="text-[9px] text-muted-foreground">{c.lastSync}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-oswald text-base font-semibold text-white">Последние задачи</h3>
                  <button className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                    Все задачи <Icon name="ArrowRight" size={12} />
                  </button>
                </div>
                <div className="space-y-2">
                  {TASKS.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                      <div className="w-1 h-8 rounded-full shrink-0"
                        style={{ background: task.priority === "high" ? "#f87171" : task.priority === "medium" ? "#facc15" : "var(--neon-green)" }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">{task.title}</div>
                        <div className="text-[11px] text-muted-foreground">{task.project} · {task.assignee}</div>
                      </div>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusStyles[task.status]}`}>
                        {task.status}
                      </span>
                      <span className="text-[11px] text-muted-foreground shrink-0">{task.due}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TASKS */}
          {activeSection === "tasks" && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {["Все", "В работе", "Ожидает", "Готово"].map((f, fi) => (
                    <button key={f} className={`text-sm px-3 py-1.5 rounded-lg transition-all ${fi === 0 ? "text-black font-medium" : "glass glass-hover text-muted-foreground hover:text-foreground"}`}
                      style={fi === 0 ? { background: "linear-gradient(135deg, var(--neon-green), var(--neon-blue))" } : {}}>
                      {f}
                    </button>
                  ))}
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-black transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, var(--neon-green), var(--neon-blue))" }}>
                  <Icon name="Plus" size={15} />
                  Новая задача
                </button>
              </div>

              <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      {["Задача", "Проект", "Приоритет", "Статус", "Срок", "Исполнитель"].map((h) => (
                        <th key={h} className="text-left text-xs text-muted-foreground font-medium px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TASKS.map((task) => (
                      <tr key={task.id} className="border-b border-white/5 hover:bg-white/4 transition-colors cursor-pointer group last:border-0">
                        <td className="px-4 py-3">
                          <span className="text-sm text-foreground group-hover:text-primary transition-colors">{task.title}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-muted-foreground">{task.project}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityStyles[task.priority]}`}>
                            {priorityLabels[task.priority]}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[task.status]}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{task.due}</td>
                        <td className="px-4 py-3">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-black"
                            style={{ background: "linear-gradient(135deg, var(--neon-purple), var(--neon-blue))" }}>
                            {task.assignee}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* WORKFLOWS */}
          {activeSection === "workflows" && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{WORKFLOWS.filter(w => w.status === "active").length} активных автоматизации из {WORKFLOWS.length}</p>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-black hover:opacity-90 transition-all"
                  style={{ background: "linear-gradient(135deg, var(--neon-green), var(--neon-blue))" }}>
                  <Icon name="Plus" size={15} />
                  Создать процесс
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {WORKFLOWS.map((wf, i) => (
                  <div key={wf.id} className="glass glass-hover rounded-xl p-5 cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0 pr-3">
                        <h3 className="font-medium text-foreground text-sm">{wf.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                          <Icon name="Zap" size={11} />
                          {wf.trigger}
                        </p>
                      </div>
                      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${wf.status === "active" ? "text-green-400 bg-green-400/10" : "text-yellow-400 bg-yellow-400/10"}`}>
                        {wf.status === "active" ? "Активен" : "Пауза"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {Array.from({ length: wf.steps }).map((_, si) => (
                        <div key={si} className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                            style={{
                              background: wf.status === "active" ? "linear-gradient(135deg, var(--neon-green), var(--neon-blue))" : "rgba(255,255,255,0.1)",
                              color: wf.status === "active" ? "black" : "rgba(255,255,255,0.4)"
                            }}>
                            {si + 1}
                          </div>
                          {si < wf.steps - 1 && (
                            <div className="w-6 h-px"
                              style={{ background: wf.status === "active" ? "var(--neon-green)" : "rgba(255,255,255,0.1)" }} />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Icon name="Play" size={11} />
                        Запущен {wf.runs} раз
                      </span>
                      <div className="flex gap-2">
                        <button className="text-xs px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
                          Изменить
                        </button>
                        <button className="text-xs px-3 py-1 rounded-md transition-colors"
                          style={{ background: "rgba(0,229,176,0.12)", color: "var(--neon-green)" }}>
                          {wf.status === "active" ? "Пауза" : "Запустить"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REPORTS */}
          {activeSection === "reports" && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 glass rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-oswald text-base font-semibold text-white">Динамика задач</h3>
                    <div className="flex gap-2">
                      {["Неделя", "Месяц", "Год"].map((p, pi) => (
                        <button key={p} className={`text-xs px-3 py-1 rounded-md transition-all ${pi === 2 ? "text-black font-medium" : "glass text-muted-foreground hover:text-foreground"}`}
                          style={pi === 2 ? { background: "linear-gradient(135deg, var(--neon-green), var(--neon-blue))" } : {}}>
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <MiniChart data={CHART_DATA} />
                  <div className="flex justify-between mt-2">
                    {CHART_MONTHS.map((m) => (
                      <span key={m} className="text-[9px] text-muted-foreground">{m}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Выполнение плана", val: 87, color: "var(--neon-green)" },
                    { label: "Эффективность команды", val: 74, color: "var(--neon-blue)" },
                    { label: "Автоматизировано", val: 62, color: "var(--neon-purple)" },
                  ].map((item) => (
                    <div key={item.label} className="glass rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className="font-oswald text-lg font-bold" style={{ color: item.color }}>{item.val}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${item.val}%`, background: item.color }} />
                      </div>
                    </div>
                  ))}

                  <button className="w-full py-3 rounded-xl text-sm font-medium text-black hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    style={{ background: "linear-gradient(135deg, var(--neon-green), var(--neon-blue))" }}>
                    <Icon name="Download" size={15} />
                    Скачать отчёт
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* INTEGRATIONS */}
          {activeSection === "integrations" && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {[
                  { name: "CRM Битрикс24", icon: "Database", status: "connected", desc: "Синхронизация клиентов и сделок", color: "var(--neon-green)" },
                  { name: "1С Предприятие", icon: "Package", status: "connected", desc: "Финансовые данные и документооборот", color: "var(--neon-green)" },
                  { name: "Telegram Bot", icon: "MessageCircle", status: "connected", desc: "Уведомления команды в реальном времени", color: "var(--neon-blue)" },
                  { name: "Google Sheets", icon: "Table2", status: "disconnected", desc: "Экспорт данных и отчётов", color: "var(--neon-purple)" },
                  { name: "Яндекс.Метрика", icon: "TrendingUp", status: "connected", desc: "Веб-аналитика и трафик", color: "var(--neon-orange)" },
                  { name: "Microsoft Teams", icon: "Monitor", status: "disconnected", desc: "Корпоративные коммуникации", color: "var(--neon-purple)" },
                ].map((int, i) => (
                  <div key={i} className="glass glass-hover rounded-xl p-5 cursor-pointer flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${int.color}18`, border: `1px solid ${int.color}30` }}>
                      <Icon name={int.icon} size={22} style={{ color: int.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-foreground text-sm">{int.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${int.status === "connected" ? "text-green-400 bg-green-400/10" : "text-muted-foreground bg-white/5"}`}>
                          {int.status === "connected" ? "Подключено" : "Отключено"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{int.desc}</p>
                    </div>
                    <button className="shrink-0 text-xs px-3 py-1.5 rounded-lg transition-all"
                      style={int.status === "connected"
                        ? { background: "rgba(0,229,176,0.12)", color: "var(--neon-green)" }
                        : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }
                      }>
                      {int.status === "connected" ? "Настроить" : "Подключить"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* USERS */}
          {activeSection === "users" && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">5 пользователей · 3 роли</p>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-black hover:opacity-90 transition-all"
                  style={{ background: "linear-gradient(135deg, var(--neon-green), var(--neon-blue))" }}>
                  <Icon name="UserPlus" size={15} />
                  Пригласить
                </button>
              </div>

              <div className="glass rounded-xl overflow-hidden">
                {[
                  { name: "Алексей Данилов", role: "Администратор", email: "a.danilov@company.ru", avatar: "АД", status: "online", lastActive: "Сейчас" },
                  { name: "Мария Петрова", role: "Менеджер", email: "m.petrova@company.ru", avatar: "МП", status: "online", lastActive: "5 мин назад" },
                  { name: "Дмитрий Рыбин", role: "Аналитик", email: "d.rybin@company.ru", avatar: "ДР", status: "offline", lastActive: "2 ч назад" },
                  { name: "Екатерина Соколова", role: "Менеджер", email: "e.sokolova@company.ru", avatar: "ЕС", status: "offline", lastActive: "Вчера" },
                  { name: "Иван Волков", role: "Аналитик", email: "i.volkov@company.ru", avatar: "ИВ", status: "online", lastActive: "15 мин назад" },
                ].map((user, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-white/5 hover:bg-white/4 transition-colors cursor-pointer last:border-0">
                    <div className="relative shrink-0">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-black"
                        style={{ background: "linear-gradient(135deg, var(--neon-purple), var(--neon-blue))" }}>
                        {user.avatar}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background ${user.status === "online" ? "bg-green-400" : "bg-gray-600"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">{user.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-muted-foreground hidden md:block">{user.role}</span>
                    <span className="text-xs text-muted-foreground hidden lg:block w-28 text-right">{user.lastActive}</span>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Icon name="MoreHorizontal" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
