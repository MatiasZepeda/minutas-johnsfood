import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Minuta, MenuRow, MENU_LABELS } from "@/lib/types";
import { CollegeTemplate } from "@/lib/types";
import { getBusinessWeeks, getMesLabel } from "@/lib/calendar";
import path from "path";

// ─── Custom fonts (local TTF — @react-pdf/renderer does not support WOFF2) ──
// Playfair Display → elegant serif for headers
// Lato → modern, readable sans-serif for body
const fontsDir = path.join(process.cwd(), "public", "fonts");

Font.register({
  family: "Playfair",
  fonts: [
    {
      src: path.join(fontsDir, "PlayfairDisplay-Bold.ttf"),
      fontWeight: 700,
    },
    {
      src: path.join(fontsDir, "PlayfairDisplay-ExtraBold.ttf"),
      fontWeight: 900,
    },
  ],
});

Font.register({
  family: "Lato",
  fonts: [
    {
      src: path.join(fontsDir, "Lato-Regular.ttf"),
      fontWeight: 400,
    },
    {
      src: path.join(fontsDir, "Lato-Bold.ttf"),
      fontWeight: 700,
    },
    {
      src: path.join(fontsDir, "Lato-Italic.ttf"),
      fontWeight: 400,
      fontStyle: "italic",
    },
  ],
});

// ─── Brand palette ────────────────────────────────────────────────────────────
const C = {
  navy:       "#29385f",
  navyLight:  "#3a4f7e",
  lightBlue:  "#b8c1d7",
  sky:        "#95ccff",
  skyLight:   "#d6edff",
  white:      "#ffffff",
  accent:     "#c0392b",   // red for school name
  gold:       "#c8a84b",   // warm accent for title line
  gray:       "#f4f6f9",
  cellBg:     "#fdfeff",
  textDark:   "#1c1c2e",
  textMid:    "#4a4a6a",
  textLight:  "#7a7a9a",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: C.white,
    paddingHorizontal: 22,
    paddingVertical: 16,
    fontFamily: "Lato",
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    minHeight: 64,
  },
  headerLogoBox: {
    width: 115,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  headerLogoImg: {
    maxWidth: 115,
    maxHeight: 64,
    objectFit: "contain",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  headerLabel: {
    fontSize: 7,
    fontFamily: "Lato",
    fontWeight: 700,
    color: C.textLight,
    textAlign: "center",
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  headerTitle: {
    fontSize: 11,
    fontFamily: "Playfair",
    fontWeight: 700,
    color: C.navy,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: "Playfair",
    fontWeight: 900,
    color: C.accent,
    textAlign: "center",
    marginTop: 2,
    letterSpacing: 0.3,
  },

  // ── Divider ──
  dividerRow: {
    flexDirection: "row",
    marginBottom: 8,
    height: 3,
  },
  dividerLeft: {
    flex: 1,
    backgroundColor: C.navy,
    borderRadius: 2,
  },
  dividerDot: {
    width: 3,
    height: 3,
    backgroundColor: C.gold,
    marginHorizontal: 3,
    borderRadius: 99,
  },
  dividerRight: {
    flex: 1,
    backgroundColor: C.navy,
    borderRadius: 2,
  },

  // ── Week block ──
  weekBlock: {
    marginBottom: 5,
    borderRadius: 4,
    overflow: "hidden",
  },

  // ── Day header row ──
  dayHeaderRow: {
    flexDirection: "row",
  },
  labelColHeader: {
    width: 74,
    backgroundColor: C.navy,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  dayHeaderCell: {
    flex: 1,
    backgroundColor: C.navy,
    borderLeftWidth: 1,
    borderLeftColor: C.navyLight,
    paddingVertical: 5,
    paddingHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  dayHeaderCellText: {
    fontSize: 6.5,
    fontFamily: "Lato",
    fontWeight: 700,
    color: C.sky,
    textAlign: "center",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  emptyDayHeader: {
    flex: 1,
    backgroundColor: C.navy,
    borderLeftWidth: 1,
    borderLeftColor: C.navyLight,
  },

  // ── Content rows ──
  contentRow: {
    flexDirection: "row",
  },
  rowLabel: {
    width: 74,
    backgroundColor: C.lightBlue,
    borderTopWidth: 1,
    borderTopColor: "#d0d8e8",
    padding: 4,
    justifyContent: "center",
  },
  rowLabelText: {
    fontSize: 6.5,
    fontFamily: "Lato",
    fontWeight: 700,
    color: C.navy,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  contentCell: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#e0e6f0",
    borderLeftWidth: 1,
    borderLeftColor: "#e0e6f0",
    padding: 4,
    justifyContent: "center",
    backgroundColor: C.cellBg,
    minHeight: 22,
  },
  contentCellText: {
    fontSize: 6.2,
    fontFamily: "Lato",
    fontWeight: 400,
    color: C.textDark,
    textAlign: "center",
    lineHeight: 1.4,
  },
  fixedCell: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#e0e6f0",
    borderLeftWidth: 1,
    borderLeftColor: "#e0e6f0",
    padding: 4,
    justifyContent: "center",
    backgroundColor: C.skyLight,
    minHeight: 18,
  },
  fixedCellText: {
    fontSize: 6,
    fontFamily: "Lato",
    fontWeight: 400,
    fontStyle: "italic",
    color: C.textMid,
    textAlign: "center",
  },
  emptyCell: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: "#e0e6f0",
    borderLeftWidth: 1,
    borderLeftColor: "#e0e6f0",
    backgroundColor: C.gray,
  },

  // ── Footer ──
  footer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: C.lightBlue,
    borderRadius: 5,
    overflow: "hidden",
  },
  footerHeader: {
    backgroundColor: C.navy,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  footerHeaderText: {
    fontSize: 6.5,
    fontFamily: "Lato",
    fontWeight: 700,
    color: C.sky,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  footerBody: {
    padding: 7,
    backgroundColor: "#f8faff",
  },
  footerLine: {
    fontSize: 5.8,
    fontFamily: "Lato",
    fontWeight: 400,
    color: C.textMid,
    lineHeight: 1.6,
    marginBottom: 1,
  },
  footerBold: {
    fontSize: 5.8,
    fontFamily: "Lato",
    fontWeight: 700,
    color: C.navy,
    lineHeight: 1.6,
    marginBottom: 1,
  },
});

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  minuta: Minuta;
  college: CollegeTemplate;
  logoJohnsFoodSrc?: string;
  logoCollegeSrc?: string;
}

const FIXED_ROWS_TOP = [{ label: "Salad Bar", value: "Ensaladas" }];
const FIXED_ROWS_BOTTOM = [
  { label: "Postres", value: "Buffet de postres" },
  { label: "Alternativa", value: "Fruta natural" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function MinutaPDF({
  minuta,
  college,
  logoJohnsFoodSrc = "/logos/johns-food.png",
  logoCollegeSrc,
}: Props) {
  const weeks = getBusinessWeeks(minuta.anio, minuta.mes);
  const mesLabel = getMesLabel(minuta.mes);
  const tp = minuta.textosPie;
  const collegeLogo = logoCollegeSrc || college.logoFile;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerLogoBox}>
            <Image src={logoJohnsFoodSrc} style={styles.headerLogoImg} />
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.headerLabel}>Gastronomía y Eventos</Text>
            <Text style={styles.headerTitle}>
              Minuta Almuerzos — {mesLabel} {minuta.anio}
            </Text>
            <Text style={styles.headerSubtitle}>
              {college.nombre}
            </Text>
          </View>
          <View style={styles.headerLogoBox}>
            <Image src={collegeLogo} style={styles.headerLogoImg} />
          </View>
        </View>

        {/* ── DIVIDER ────────────────────────────────────────────────────── */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLeft} />
          <View style={styles.dividerDot} />
          <View style={styles.dividerRight} />
        </View>

        {/* ── CALENDAR WEEKS ─────────────────────────────────────────────── */}
        {weeks.map((week) => {
          const cols = week.days;
          const emptyCount = 5 - cols.length;

          return (
            <View key={week.weekIndex} style={styles.weekBlock} wrap={false}>

              {/* Day header row */}
              <View style={styles.dayHeaderRow}>
                <View style={styles.labelColHeader} />
                {cols.map((day) => (
                  <View key={day.isoDate} style={styles.dayHeaderCell}>
                    <Text style={styles.dayHeaderCellText}>{day.label}</Text>
                  </View>
                ))}
                {Array.from({ length: emptyCount }).map((_, i) => (
                  <View key={`eh-${i}`} style={styles.emptyDayHeader} />
                ))}
              </View>

              {/* Fixed top rows */}
              {FIXED_ROWS_TOP.map((row) => (
                <View key={row.label} style={styles.contentRow}>
                  <View style={styles.rowLabel}>
                    <Text style={styles.rowLabelText}>{row.label}</Text>
                  </View>
                  {cols.map((day) => (
                    <View key={day.isoDate} style={styles.fixedCell}>
                      <Text style={styles.fixedCellText}>{row.value}</Text>
                    </View>
                  ))}
                  {Array.from({ length: emptyCount }).map((_, i) => (
                    <View key={`ef-${i}`} style={styles.emptyCell} />
                  ))}
                </View>
              ))}

              {/* Variable menu rows */}
              {college.menuRows.map((rowKey: MenuRow) => (
                <View key={rowKey} style={styles.contentRow}>
                  <View style={styles.rowLabel}>
                    <Text style={styles.rowLabelText}>{MENU_LABELS[rowKey]}</Text>
                  </View>
                  {cols.map((day) => (
                    <View key={day.isoDate} style={styles.contentCell}>
                      <Text style={styles.contentCellText}>
                        {minuta.dias[day.isoDate]?.[rowKey] || ""}
                      </Text>
                    </View>
                  ))}
                  {Array.from({ length: emptyCount }).map((_, i) => (
                    <View key={`ev-${i}`} style={styles.emptyCell} />
                  ))}
                </View>
              ))}

              {/* Fixed bottom rows */}
              {FIXED_ROWS_BOTTOM.map((row) => (
                <View key={row.label} style={styles.contentRow}>
                  <View style={styles.rowLabel}>
                    <Text style={styles.rowLabelText}>{row.label}</Text>
                  </View>
                  {cols.map((day) => (
                    <View key={day.isoDate} style={styles.fixedCell}>
                      <Text style={styles.fixedCellText}>{row.value}</Text>
                    </View>
                  ))}
                  {Array.from({ length: emptyCount }).map((_, i) => (
                    <View key={`eb-${i}`} style={styles.emptyCell} />
                  ))}
                </View>
              ))}
            </View>
          );
        })}

        {/* ── FOOTER ─────────────────────────────────────────────────────── */}
        <View style={styles.footer}>
          <View style={styles.footerHeader}>
            <Text style={styles.footerHeaderText}>
              Observaciones Generales — {tp.observacionesGenerales}
            </Text>
          </View>
          <View style={styles.footerBody}>
            <Text style={styles.footerLine}>{tp.menuPrincipal}</Text>
            <Text style={styles.footerLine}>{tp.menuHipocalorico}</Text>
            {tp.menuVegetariano && (
              <Text style={styles.footerLine}>{tp.menuVegetariano}</Text>
            )}
            <Text style={styles.footerBold}>{tp.valores}</Text>
            <Text style={styles.footerLine}>{tp.pagos}</Text>
            <Text style={styles.footerLine}>{tp.contacto}</Text>
            <Text style={styles.footerLine}>{tp.inasistencias}</Text>
            <Text style={styles.footerLine}>{tp.cambios}</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}
