import Link from "next/link";

const scenarios = [
    {
        title: "초회 보험료 납입",
        desc: "보험 심사가 승인되었습니다. 첫 번째 보험료를 납부하면 계약이 체결됩니다.",
        badge: "신규 계약",
    },
    {
        title: "미납 보험료 납입",
        desc: "자동이체 실패로 미납된 보험료가 있습니다. 지금 납부하지 않으면 계약이 실효될 수 있습니다.",
        badge: "긴급",
    },
    {
        title: "계약 부활 납입",
        desc: "실효된 계약을 되살리려면 연체된 보험료와 이자를 한꺼번에 납부해야 합니다.",
        badge: "부활 신청",
    },
];

export default function Home() {
    return (
        <main className="landing">
            <header className="landing-header">
                <span className="landing-logo">🛡️</span>
                <h1>한국생명보험</h1>
                <p>보험료 납부 포털</p>
            </header>

            <section className="scenario-list">
                {scenarios.map((s) => (
                    <Link key={s.title} href="/payments" className="scenario-card">
                        <span className="scenario-badge">{s.badge}</span>
                        <h2>{s.title}</h2>
                        <p>{s.desc}</p>
                    </Link>
                ))}
            </section>
        </main>
    );
}
