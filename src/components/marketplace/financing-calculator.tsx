"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Calculator, TrendingUp, Wallet, Receipt } from "lucide-react"
import { formatearPrecio } from "@/lib/format"
import { cn } from "@/lib/utils"

interface FinancingCalculatorProps {
  precio: number
}

export function FinancingCalculator({ precio }: FinancingCalculatorProps) {
  const [cuotaInicial, setCuotaInicial] = useState(Math.round(precio * 0.2))
  const [numCuotas, setNumCuotas] = useState(48)
  const [tasaInteres, setTasaInteres] = useState(6.5)

  const calculo = useMemo(() => {
    const montoFinanciar = Math.max(0, precio - cuotaInicial)
    const tasaMensual = tasaInteres / 100 / 12
    // Fórmula de amortización francesa
    const cuotaMensual =
      montoFinanciar === 0 || numCuotas === 0
        ? 0
        : tasaMensual === 0
          ? montoFinanciar / numCuotas
          : (montoFinanciar * tasaMensual * Math.pow(1 + tasaMensual, numCuotas)) /
            (Math.pow(1 + tasaMensual, numCuotas) - 1)
    const totalPagar = cuotaMensual * numCuotas + cuotaInicial
    const totalInteres = cuotaMensual * numCuotas - montoFinanciar
    return { montoFinanciar, cuotaMensual, totalPagar, totalInteres }
  }, [precio, cuotaInicial, numCuotas, tasaInteres])

  const maxCuotaInicial = precio
  const porcentajeInicial = Math.round((cuotaInicial / precio) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-border/70 bg-card p-6 sm:p-7"
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground">
          <Calculator className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            Simulador de financiamiento
          </h3>
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Estimación visual, no es una oferta real
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {/* Cuota inicial */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Cuota inicial
            </label>
            <span className="text-sm font-semibold text-foreground">
              {formatearPrecio(cuotaInicial)}{" "}
              <span className="text-muted-foreground">({porcentajeInicial}%)</span>
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={maxCuotaInicial}
            step={1000}
            value={cuotaInicial}
            onChange={(e) => setCuotaInicial(Number(e.target.value))}
            className="slider-premium mt-2"
            aria-label="Cuota inicial"
          />
        </div>

        {/* Número de cuotas */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Número de cuotas
            </label>
            <span className="text-sm font-semibold text-foreground">
              {numCuotas} meses
            </span>
          </div>
          <input
            type="range"
            min={12}
            max={84}
            step={12}
            value={numCuotas}
            onChange={(e) => setNumCuotas(Number(e.target.value))}
            className="slider-premium mt-2"
            aria-label="Número de cuotas"
          />
          <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
            <span>12</span>
            <span>84</span>
          </div>
        </div>

        {/* Tasa de interés */}
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              Tasa de interés anual
            </label>
            <span className="text-sm font-semibold text-foreground">
              {tasaInteres.toFixed(1)}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={15}
            step={0.5}
            value={tasaInteres}
            onChange={(e) => setTasaInteres(Number(e.target.value))}
            className="slider-premium mt-2"
            aria-label="Tasa de interés"
          />
        </div>
      </div>

      {/* Resultados */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ResultadoCard
          icono={Wallet}
          etiqueta="Cuota mensual"
          valor={formatearPrecio(calculo.cuotaMensual)}
          destacado
        />
        <ResultadoCard
          icono={Receipt}
          etiqueta="Monto financiado"
          valor={formatearPrecio(calculo.montoFinanciar)}
        />
        <ResultadoCard
          icono={TrendingUp}
          etiqueta="Total a pagar"
          valor={formatearPrecio(calculo.totalPagar)}
          subtitulo={`Intereses: ${formatearPrecio(calculo.totalInteres)}`}
        />
      </div>
    </motion.div>
  )
}

function ResultadoCard({
  icono: Icono,
  etiqueta,
  valor,
  subtitulo,
  destacado,
}: {
  icono: typeof Wallet
  etiqueta: string
  valor: string
  subtitulo?: string
  destacado?: boolean
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        destacado
          ? "border-[var(--signature)]/40 bg-[var(--signature)]/5"
          : "border-border/70 bg-secondary/40"
      )}
    >
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icono className="h-3.5 w-3.5" strokeWidth={2} />
        <span className="text-[10px] font-medium uppercase tracking-wider">
          {etiqueta}
        </span>
      </div>
      <p
        className={cn(
          "mt-2 font-semibold tracking-tight",
          destacado ? "text-[var(--signature)] text-lg" : "text-foreground text-base"
        )}
      >
        {valor}
      </p>
      {subtitulo && (
        <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitulo}</p>
      )}
    </div>
  )
}
