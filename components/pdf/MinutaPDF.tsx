import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import { Minuta, MenuRow, MENU_LABELS } from "@/lib/types";
import { CollegeTemplate } from "@/lib/types";
import { getBusinessWeeks, getMesLabel } from "@/lib/calendar";

// Brand colors
const C = {
  navy: "#29385f",
  lightBlue: "#b8c1d7",
  sky: "#95ccff",
  white: "#ffffff",
  red: "#c0392b",
  gray: "#f5f5f5",
  textDark: "#1a1a1a",
  textGray: "#555555",
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: C.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    minHeight: 60,
  },
  headerLogoBox: {
    width: 110,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  headerLogoImg: {
    maxWidth: 110,
    maxHeight: 60,
    objectFit: "contain",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: C.navy,
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: C.red,
    textAlign: "center",
    textTransform: "uppercase",
    marginTop: 2,
  },
  divider: {
    height: 2,
    backgroundColor: C.navy,
    marginBottom: 8,
  },
  weekBlock: {
    marginBottom: 6,
  },
  dayHeaderRow: {
    flexDirection: "row",
  },
  labelCol: {
    width: 75,
    backgroundColor: C.navy,
    borderColor: C.navy,
    borderWidth: 0.5,
    padding: 4,
    justifyContent: "center",
  },
  labelColText: {
    fontSize: 6.5,
    color: C.white,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    textTransform: "uppercase",
  },
  dayHeaderCell: {
    flex: 1,
    backgroundColor: C.sky,
    borderColor: C.navy,
    borderWidth: 0.5,
    padding: 4,
    alignItems: "center",
  },
  dayHeaderCellText: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: C.navy,
    textAlign: "center",
    textTransform: "uppercase",
  },
  emptyDayHeader: {
    flex: 1,
    backgroundColor: C.sky,
    borderColor: C.navy,
    borderWidth: 0.5,
  },
  contentRow: {
    flexDirection: "row",
  },
  rowLabel: {
    width: 75,
    backgroundColor: C.lightBlue,
    borderColor: "#c0c8d8",
    borderWidth: 0.5,
    padding: 4,
    justifyContent: "center",
  },
  rowLabelText: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: C.navy,
    textAlign: "left",
  },
  contentCell: {
    flex: 1,
    borderColor: "#c0c8d8",
    borderWidth: 0.5,
    padding: 4,
    justifyContent: "center",
    backgroundColor: C.white,
  },
  fixedCell: {
    flex: 1,
    borderColor: "#c0c8d8",
    borderWidth: 0.5,
    padding: 4,
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  contentCellText: {
    fontSize: 6,
    color: C.textDark,
    textAlign: "center",
    lineHeight: 1.3,
  },
  fixedCellText: {
    fontSize: 6,
    color: C.textGray,
    textAlign: "center",
    fontFamily: "Helvetica-Oblique",
  },
  emptyCell: {
    flex: 1,
    borderColor: "#c0c8d8",
    borderWidth: 0.5,
    backgroundColor: C.gray,
  },
  footer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: C.navy,
    borderRadius: 4,
    padding: 6,
    backgroundColor: "#fafcff",
  },
  footerTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.navy,
    marginBottom: 3,
  },
  footerText: {
    fontSize: 6,
    color: C.textDark,
    lineHeight: 1.5,
    marginBottom: 1.5,
  },
  footerBold: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: C.navy,
    marginBottom: 1.5,
  },
});

interface Props {
  minuta: Minuta;
  college: CollegeTemplate;
  // Server-side: pass absolute filesystem paths to logos
  logoJohnsFoodSrc?: string;
  logoCollegeSrc?: string;
}

const FIXED_ROWS_TOP = [{ label: "Salad Bar", value: "Ensaladas" }];
const FIXED_ROWS_BOTTOM = [
  { label: "Postres", value: "Buffet de postres" },
  { label: "Alternativa", value: "Fruta natural" },
];

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
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLogoBox}>
            <Image src={logoJohnsFoodSrc} style={styles.headerLogoImg} />
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              MINUTA ALMUERZOS MES DE {mesLabel} {minuta.anio}
            </Text>
            <Text style={styles.headerSubtitle}>
              {college.nombre.toUpperCase()}
            </Text>
          </View>
          <View style={styles.headerLogoBox}>
            <Image src={collegeLogo} style={styles.headerLogoImg} />
          </View>
        </View>

        <View style={styles.divider} />

        {/* CALENDAR WEEKS */}
        {weeks.map((week) => {
          const cols = week.days;
          const emptyCount = 5 - cols.length;

          return (
            <View key={week.weekIndex} style={styles.weekBlock} wrap={false}>
              {/* Day header row */}
              <View style={styles.dayHeaderRow}>
                <View style={styles.labelCol}>
                  <Text style={styles.labelColText}> </Text>
                </View>
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
                    <Text style={styles.rowLabelText}>
                      {MENU_LABELS[rowKey]}
                    </Text>
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

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>
            Observaciones Generales: {tp.observacionesGenerales}
          </Text>
          <Text style={styles.footerText}>{tp.menuPrincipal}</Text>
          <Text style={styles.footerText}>{tp.menuHipocalorico}</Text>
          {tp.menuVegetariano && (
            <Text style={styles.footerText}>{tp.menuVegetariano}</Text>
          )}
          <Text style={styles.footerBold}>{tp.valores}</Text>
          <Text style={styles.footerText}>{tp.pagos}</Text>
          <Text style={styles.footerText}>{tp.contacto}</Text>
          <Text style={styles.footerText}>{tp.inasistencias}</Text>
          <Text style={styles.footerText}>{tp.cambios}</Text>
        </View>
      </Page>
    </Document>
  );
}
