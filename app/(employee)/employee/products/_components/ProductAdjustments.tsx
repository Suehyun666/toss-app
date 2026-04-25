export default function ProductAdjustments({ adjustments }: { adjustments: any[] }) {
    if (!adjustments?.length) return null;
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-600 mb-3">할인·할증 ({adjustments.length})</h2>
            <table className="w-full text-xs">
                <thead>
                    <tr className="text-gray-400 border-b border-gray-100">
                        <th className="pb-2 text-left font-medium">항목</th>
                        <th className="pb-2 text-left font-medium">구분</th>
                        <th className="pb-2 text-right font-medium">율(%)</th>
                        <th className="pb-2 text-left font-medium">조건</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {adjustments.map((a: any) => (
                        <tr key={a.id}>
                            <td className="py-2">{a.itemName}</td>
                            <td className="py-2">{a.adjType === "DISCOUNT" ? "할인" : "할증"}</td>
                            <td className="py-2 text-right">{a.rate}</td>
                            <td className="py-2 text-gray-400">{a.conditionDesc}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
