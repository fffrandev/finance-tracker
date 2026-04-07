"use client";

type Props = {
  title: string;
  amount: number;
};

export default function BalanceCard({ title, amount }: Props) {
  return (
    <div className="bg-white text-black p-5 rounded-2xl">
      <p className="text-sm font-medium text-gray-700">{title}</p>

      <p className="text-3xl font-bold mt-1">
        ${amount.toLocaleString("es-AR")}
      </p>
    </div>
  );
}
