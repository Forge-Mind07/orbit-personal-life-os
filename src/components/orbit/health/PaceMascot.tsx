import { useId } from "react";
import type { PaceAction, PaceMood } from "@/lib/orbit/pace";

export function PaceMascot({ action, mood, active }: { action: PaceAction; mood: PaceMood; active: boolean }) {
  const id = useId().replace(/:/g, "");
  const fill = (name: string) => `url(#${id}-${name})`;
  return <svg viewBox="0 0 280 310" className={`pace-mascot pace-${action} pace-mood-${mood} ${active ? "pace-active" : ""}`} aria-hidden="true">
    <defs>
      {[
        { name: "jacket", a: "var(--pace-jacket-light)", b: "var(--pace-jacket)", c: "var(--pace-jacket-shade)" },
        { name: "pants", a: "var(--pace-pants-light)", b: "var(--pace-pants)", c: "var(--pace-pants-shade)" },
        { name: "skin", a: "var(--pace-skin-light)", b: "var(--pace-skin)", c: "var(--pace-skin-shade)" },
        { name: "hat", a: "var(--pace-hat-light)", b: "var(--pace-hat)", c: "var(--primary)" },
        { name: "shoe", a: "var(--pace-shoe-light)", b: "var(--pace-shoe)", c: "var(--pace-shoe-shade)" },
      ].map((g) => <linearGradient key={g.name} id={`${id}-${g.name}`} x1="0" y1="0" x2="1" y2="0.8"><stop offset="0" stopColor={g.a} /><stop offset="0.55" stopColor={g.b} /><stop offset="1" stopColor={g.c} /></linearGradient>)}
    </defs>
    <path d="M20 260C5 205 50 207 65 245S221 300 261 217" fill="none" stroke="var(--health-cyan)" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" />
    <ellipse className="pace-ground" cx="143" cy="283" rx="64" ry="10" fill="var(--runner-shadow)" />
    <g className="pace-body">
      <g className="pace-leg pace-leg-back">
        <path d="M144 204C151 195 174 196 180 209L177 242 160 267 139 257 149 232 134 217Z" fill={fill("pants")} />
        <path d="M151 257Q159 252 165 260L177 267Q194 270 190 279Q186 286 157 281L138 274Q134 263 151 257Z" fill={fill("shoe")} />
        <path d="M140 272Q157 282 188 277L188 282Q170 289 140 277Z" fill="var(--surface)" />
        <path d="M158 265L168 268M156 269L167 272" stroke="var(--surface)" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g className="pace-arm pace-arm-back">
        <path d="M164 155Q180 140 190 154L211 174 223 151Q233 146 238 157L225 193Q218 204 206 196L176 177Z" fill={fill("jacket")} />
        <ellipse cx="232" cy="151" rx="12" ry="14" transform="rotate(28 232 151)" fill={fill("skin")} />
        <path d="M231 142L233 151M237 145L237 153" stroke="var(--pace-skin-shade)" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <g className="pace-leg pace-leg-front">
        <path d="M114 204Q121 195 144 202L143 236 124 270 102 261 114 233 105 217Z" fill={fill("pants")} />
        <path d="M110 260Q116 257 125 264L130 275Q138 286 130 291L97 290Q77 290 78 281Q79 272 98 269Z" fill={fill("shoe")} />
        <path d="M79 282Q90 289 133 285L132 291Q106 298 82 288Z" fill="var(--surface)" />
        <path d="M104 271L117 273M103 275L117 277" stroke="var(--surface)" strokeWidth="2" strokeLinecap="round" />
        <path d="M116 224L116 243" stroke="var(--pace-pants-light)" strokeWidth="3" strokeLinecap="round" />
      </g>
      <path d="M104 147Q136 130 168 147Q177 161 177 198Q171 224 141 227L113 222Q94 213 98 191Z" fill={fill("jacket")} />
      <path d="M100 198Q134 216 175 198L171 213Q136 231 108 213Z" fill="var(--pace-jacket-shade)" />
      <path d="M133 151L138 213" stroke="var(--pace-shoe-light)" strokeWidth="3" />
      <rect x="132" y="164" width="7" height="10" rx="3" fill="var(--surface)" />
      <path d="M108 178L123 183 121 197M151 181L165 174 168 189" fill="none" stroke="var(--pace-jacket-shade)" strokeWidth="2" strokeLinecap="round" />
      <path d="M108 153Q115 147 123 149" fill="none" stroke="var(--pace-jacket-light)" strokeWidth="6" strokeLinecap="round" />
      <g className="pace-arm pace-arm-front">
        <path d="M106 151Q93 141 84 155L67 175 52 159Q39 159 41 174L60 195Q69 202 79 194L107 174Z" fill={fill("jacket")} />
        <path d="M43 163L57 170 50 181 39 172Z" fill="var(--pace-jacket-shade)" />
        <path d="M47 162Q47 151 39 147Q31 144 29 151Q21 144 18 151Q15 158 21 163L32 175Q42 180 49 171Z" fill={fill("skin")} />
        <path d="M25 155L32 163M31 152L38 160" stroke="var(--pace-skin-shade)" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <g className="pace-head">
        <rect x="122" y="130" width="28" height="25" rx="12" fill={fill("skin")} />
        <ellipse cx="82" cy="102" rx="12" ry="17" fill={fill("skin")} /><ellipse cx="190" cy="102" rx="12" ry="17" fill={fill("skin")} />
        <path d="M82 73Q88 36 134 35Q183 32 191 74L189 108Q186 142 143 151Q102 149 87 121Z" fill={fill("skin")} />
        <path d="M87 77Q91 45 119 43" fill="none" stroke="var(--pace-skin-light)" strokeWidth="8" strokeLinecap="round" />
        <ellipse cx="104" cy="117" rx="11" ry="6" fill="var(--pace-blush)" /><ellipse cx="170" cy="117" rx="11" ry="6" fill="var(--pace-blush)" />
        <path d="M105 88Q114 82 123 87M152 86Q161 80 170 87" fill="none" stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" />
        <g className="pace-eyes"><ellipse cx="115" cy="102" rx="8" ry="11" fill="var(--foreground)" /><ellipse cx="160" cy="101" rx="8" ry="11" fill="var(--foreground)" /><circle cx="117" cy="98" r="3" fill="var(--surface)" /><circle cx="162" cy="97" r="3" fill="var(--surface)" /></g>
        <path d="M134 107Q126 118 139 117" fill="none" stroke="var(--pace-skin-shade)" strokeWidth="3" strokeLinecap="round" />
        <path className="pace-smile" d="M124 127Q138 145 153 125Q139 132 124 127Z" fill="var(--foreground)" />
        <path d="M127 128Q140 133 151 127" stroke="var(--surface)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M77 73Q79 24 126 20Q172 13 186 51L187 68Q141 52 93 80Z" fill={fill("hat")} />
        <path d="M80 62Q137 35 190 62Q211 68 206 76Q199 84 180 77Q134 61 86 85Z" fill={fill("hat")} />
        <path d="M97 38Q108 27 123 27" stroke="var(--pace-hat-light)" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M130 23Q149 35 151 53" stroke="var(--primary)" strokeWidth="2" opacity="0.35" fill="none" />
        <g transform="rotate(-8 135 60)"><rect x="106" y="48" width="26" height="16" rx="7" fill="var(--primary)" /><rect x="137" y="48" width="26" height="16" rx="7" fill="var(--primary)" /><path d="M131 54L138 54" stroke="var(--foreground)" strokeWidth="3" /><path d="M112 52L123 52M143 52L153 52" stroke="var(--health-cyan)" strokeWidth="3" strokeLinecap="round" /></g>
      </g>
    </g>
    {(action === "celebrate" || action === "cheer") && <g className="pace-sparkles" fill="var(--pace-shoe)">{[ [35,70], [236,66], [220,126], [56,116], [215,223], [48,228] ].map(([x,y],i) => <path key={i} className={`pace-spark pace-spark-${i}`} d={`M${x} ${Number(y)-8}l3 5 5 3-5 3-3 5-3-5-5-3 5-3Z`} />)}</g>}
  </svg>;
}