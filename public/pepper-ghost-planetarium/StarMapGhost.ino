/*
  ESP32 + ILI9341 2.8" TFT — Star Map (Los Altos CA, Aug 1 2025, midnight)

  Star positions manually mapped from the actual sky chart.
  The star DATA is laid out around DESIGN centre (160,120) with radius R=115.

  >>> CENTERING UNDER THE CUBE <<<
  The map is DRAWN and ROTATED around CUBE_CX / CUBE_CY — the pixel where the cube's
  centre actually falls on the panel. Default is the screen centre (160,120); if the
  picture isn't centred in the cube, run CALIBRATE mode (below) and nudge CUBE_CX/CUBE_CY
  until the crosshair sits dead-centre in the cube and the ring fills it. Then set
  CALIBRATE=false and reflash.

  MAP_SCALE shrinks the whole field so it sits under the 35mm cube without edge clipping.

  Wiring:
    TFT VCC->3V3  GND->GND  CS->D5  RESET->D4  DC->D2  MOSI->D23  SCK->D18  LED->VIN  MISO->n/c
*/

#include <SPI.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ILI9341.h>

#define TFT_CS   5
#define TFT_DC   2
#define TFT_RST  4

Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC, TFT_RST);

#define SCREEN_W  320
#define SCREEN_H  240

// ── Centring controls ─────────────────────────────────────────────────────────
const int   DESIGN_CX = 160, DESIGN_CY = 120;  // centre the star DATA was mapped to
const int   R         = 115;                   // design radius of the map

// The cube's centre on the LCD, in pixels. The map is drawn & rotates around this.
// Tweak these two numbers until the map sits centred under your cube.
int   CUBE_CX = 180;
int   CUBE_CY = 120;

// Shrink the map so it fits UNDER the 35mm cube (115 px is ~35mm = the cube itself).
//   0.92 -> ~106 px -> ~32.5 mm.  Lower if it clips at the edge, raise to fill more.
const float MAP_SCALE = 0.92f;

// The beamsplitter cube REFLECTS the image, which flips it left<->right. Pre-mirror
// here so the sky reads correctly (and sits centred) in the cube's reflection.
// If it ends up reversed, set this to false.
const bool  MIRROR_X = true;

// Calibration: draws ONLY a crosshair + ring so you can align CUBE_CX/CUBE_CY to the
// cube. Set true to align, then back to false for the real star map.
const bool  CALIBRATE = false;

static inline int16_t sxOff(float v) { return (int16_t)lroundf(v * MAP_SCALE); }

// Colors (RGB565)
#define COL_BG     0x0000   // black
#define COL_BRIGHT 0xFFFF   // pure white
#define COL_MEDIUM 0xDEFB   // bright blue-white
#define COL_DIM    0xAD75   // grey-white
#define COL_PLANET 0x435F   // blue

enum StarKind : uint8_t { TINY = 0, SMALL = 1, BRIGHT = 2 };

struct Star {
  int16_t  x, y;        // base (original) position
  int16_t  lx, ly;      // last drawn position — needed to erase before moving
  uint8_t  kind;
  uint16_t period;       // twinkle cycle (ms)
  uint16_t offset;       // twinkle phase offset
  uint8_t  duty;
  bool     lastOn;
  // BRIGHT-only: independent pixel spin
  bool     spinCross;    // true = + shape, false = × shape
  uint16_t spinPeriod;   // ms per orientation (how long each shape holds)
  uint16_t spinOffset;   // phase offset so stars don't all flip together
};

// ── Fixed star positions from actual star map ────────────────────────────────

struct FixedStar { int16_t x, y; uint8_t kind; };

static const FixedStar FIXED[] = {

  // ── BRIGHT (large prominent stars) ─────────────────────────────────────────
  {200, 28,  BRIGHT}, {209, 32,  BRIGHT}, {204, 39,  BRIGHT},
  {76,  44,  BRIGHT}, {91,  48,  BRIGHT},
  {111, 36,  BRIGHT}, {113, 53,  BRIGHT},
  {234, 52,  BRIGHT},
  {143, 102, BRIGHT},
  {241, 103, BRIGHT}, {260, 114, BRIGHT},
  {250, 161, BRIGHT},
  {225, 201, BRIGHT}, {230, 207, BRIGHT}, {228, 208, BRIGHT}, {222, 213, BRIGHT},
  {79,  197, BRIGHT},

  // ── SMALL (medium visible stars) ───────────────────────────────────────────
  {130, 40,  SMALL}, {142, 43,  SMALL}, {177, 43,  SMALL}, {192, 42,  SMALL}, {218, 43,  SMALL},
  {100, 57,  SMALL}, {83,  60,  SMALL}, {120, 66,  SMALL}, {98,  72,  SMALL}, {152, 74,  SMALL},
  {225, 56,  SMALL}, {245, 65,  SMALL}, {171, 76,  SMALL}, {184, 70,  SMALL}, {202, 70,  SMALL},
  {211, 70,  SMALL}, {238, 70,  SMALL},
  {147, 55,  SMALL}, {160, 68,  SMALL}, {170, 58,  SMALL},
  {84,  98,  SMALL}, {95,  103, SMALL}, {118, 108, SMALL}, {130, 93,  SMALL}, {125, 130, SMALL},
  {138, 93,  SMALL}, {155, 85,  SMALL}, {165, 103, SMALL}, {178, 89,  SMALL}, {181, 103, SMALL},
  {192, 97,  SMALL}, {192, 110, SMALL}, {175, 126, SMALL}, {165, 132, SMALL}, {150, 138, SMALL},
  {208, 100, SMALL}, {224, 90,  SMALL}, {270, 98,  SMALL}, {174, 111, SMALL}, {158, 110, SMALL},
  {149, 110, SMALL},
  {109, 147, SMALL}, {115, 153, SMALL}, {110, 155, SMALL}, {120, 148, SMALL}, {141, 147, SMALL},
  {153, 141, SMALL}, {163, 146, SMALL}, {175, 140, SMALL}, {184, 146, SMALL}, {199, 140, SMALL},
  {215, 148, SMALL}, {234, 137, SMALL}, {180, 140, SMALL}, {195, 160, SMALL}, {170, 165, SMALL},
  {155, 160, SMALL}, {106, 175, SMALL},
  {93,  163, SMALL}, {84,  168, SMALL}, {120, 170, SMALL}, {135, 175, SMALL},
  {95,  185, SMALL}, {121, 187, SMALL}, {137, 183, SMALL}, {165, 186, SMALL}, {183, 182, SMALL},
  {200, 188, SMALL}, {215, 182, SMALL}, {232, 189, SMALL},
};

#define NUM_FIXED  (sizeof(FIXED) / sizeof(FIXED[0]))
#define NUM_RAND   180
#define NUM_STARS  (NUM_FIXED + NUM_RAND)

Star stars[NUM_STARS];

// Planet — left side, mid-height (in DESIGN coordinates)
const int PX = 73, PY = 120;

uint16_t starColor(uint8_t kind) {
  switch (kind) {
    case BRIGHT: return COL_BRIGHT;
    case SMALL:  return COL_MEDIUM;
    default:     return COL_DIM;
  }
}

// ── Draw / erase ─────────────────────────────────────────────────────────────

void drawStar(int16_t x, int16_t y, uint8_t kind, uint16_t color, bool crossMode = true) {
  switch (kind) {
    case TINY:
      tft.drawPixel(x, y, color);
      break;
    case SMALL:
      tft.drawPixel(x, y, color);
      tft.drawPixel(x - 1, y, color); tft.drawPixel(x + 1, y, color);
      tft.drawPixel(x, y - 1, color); tft.drawPixel(x, y + 1, color);
      break;
    case BRIGHT:
      tft.fillCircle(x, y, 2, color);
      if (crossMode) {
        tft.drawPixel(x - 4, y, color); tft.drawPixel(x - 3, y, color);
        tft.drawPixel(x + 3, y, color); tft.drawPixel(x + 4, y, color);
        tft.drawPixel(x, y - 4, color); tft.drawPixel(x, y - 3, color);
        tft.drawPixel(x, y + 3, color); tft.drawPixel(x, y + 4, color);
      } else {
        tft.drawPixel(x - 3, y - 3, color); tft.drawPixel(x - 2, y - 2, color);
        tft.drawPixel(x + 2, y - 2, color); tft.drawPixel(x + 3, y - 3, color);
        tft.drawPixel(x - 2, y + 2, color); tft.drawPixel(x - 3, y + 3, color);
        tft.drawPixel(x + 2, y + 2, color); tft.drawPixel(x + 3, y + 3, color);
      }
      break;
  }
}

void eraseStar(int16_t x, int16_t y, uint8_t kind) {
  if (kind == BRIGHT) {
    tft.fillCircle(x, y, 2, COL_BG);
    tft.drawPixel(x - 4, y, COL_BG); tft.drawPixel(x - 3, y, COL_BG);
    tft.drawPixel(x + 3, y, COL_BG); tft.drawPixel(x + 4, y, COL_BG);
    tft.drawPixel(x, y - 4, COL_BG); tft.drawPixel(x, y - 3, COL_BG);
    tft.drawPixel(x, y + 3, COL_BG); tft.drawPixel(x, y + 4, COL_BG);
    tft.drawPixel(x - 3, y - 3, COL_BG); tft.drawPixel(x - 2, y - 2, COL_BG);
    tft.drawPixel(x + 2, y - 2, COL_BG); tft.drawPixel(x + 3, y - 3, COL_BG);
    tft.drawPixel(x - 2, y + 2, COL_BG); tft.drawPixel(x - 3, y + 3, COL_BG);
    tft.drawPixel(x + 2, y + 2, COL_BG); tft.drawPixel(x + 3, y + 3, COL_BG);
  } else {
    drawStar(x, y, kind, COL_BG);
  }
}

void drawPlanetAt(int16_t px, int16_t py) {
  tft.fillCircle(px, py, 3, COL_PLANET);
  tft.fillCircle(px, py, 1, 0x7FFF);
  tft.drawPixel(px - 7, py + 2, 0x4228); tft.drawPixel(px - 6, py + 2, 0x632C);
  tft.drawPixel(px - 5, py + 1, 0x8430); tft.drawPixel(px - 4, py + 1, 0xAD55);
  tft.drawPixel(px + 4, py - 1, 0xAD55); tft.drawPixel(px + 5, py - 1, 0x8430);
  tft.drawPixel(px + 6, py - 2, 0x632C); tft.drawPixel(px + 7, py - 2, 0x4228);
}

// Alignment target — drawn around the CUBE centre so you can centre it in the cube
void drawCalibration() {
  int rr = (int)lroundf(R * MAP_SCALE);
  tft.drawCircle(CUBE_CX, CUBE_CY, rr, COL_DIM);
  tft.drawCircle(CUBE_CX, CUBE_CY, rr / 2, COL_DIM);
  tft.drawFastHLine(CUBE_CX - 14, CUBE_CY, 29, COL_MEDIUM);
  tft.drawFastVLine(CUBE_CX, CUBE_CY - 14, 29, COL_MEDIUM);
  tft.fillCircle(CUBE_CX, CUBE_CY, 2, COL_BRIGHT);
}

// ── Generate star array ──────────────────────────────────────────────────────

void generateStars() {
  randomSeed(0xC0FFEE);

  for (int i = 0; i < (int)NUM_FIXED; i++) {
    stars[i].x = FIXED[i].x;  stars[i].y = FIXED[i].y;
    stars[i].lx = FIXED[i].x; stars[i].ly = FIXED[i].y;
    stars[i].kind = FIXED[i].kind;  stars[i].lastOn = false;
    stars[i].offset = random(0, 6000);
    switch (FIXED[i].kind) {
      case BRIGHT:
        stars[i].duty = random(92, 100); stars[i].period = random(1500, 3500);
        stars[i].spinCross = true;
        stars[i].spinPeriod = random(800, 3500); stars[i].spinOffset = random(0, 7000);
        break;
      case SMALL:
        stars[i].duty = random(82, 96); stars[i].period = random(700, 2500); break;
      default:
        stars[i].duty = random(65, 88); stars[i].period = random(300, 1600);
    }
  }

  // random background fill, generated in DESIGN space (scaled in under the cube at draw)
  int placed = NUM_FIXED, attempts = 0;
  while (placed < NUM_STARS && attempts < 30000) {
    attempts++;
    int x = random(DESIGN_CX - R, DESIGN_CX + R + 1);
    int y = random(DESIGN_CY - R, DESIGN_CY + R + 1);
    int dx = x - DESIGN_CX, dy = y - DESIGN_CY;
    if ((long)dx*dx + (long)dy*dy > (long)R*R) continue;
    int pdx = x - PX, pdy = y - PY;
    if (pdx*pdx + pdy*pdy < 36) continue;
    stars[placed].x = x;  stars[placed].y = y;
    stars[placed].lx = x; stars[placed].ly = y;
    stars[placed].kind = TINY;
    stars[placed].duty = random(45, 82); stars[placed].period = random(250, 1500);
    stars[placed].offset = random(0, 5000); stars[placed].lastOn = false;
    placed++;
  }
}

#define ROT_DEG_PER_SEC  5.0f
int16_t gPlanetLX, gPlanetLY;

void setup() {
  Serial.begin(115200);
  tft.begin();
  tft.setRotation(1);
  tft.fillScreen(COL_BG);

  if (CALIBRATE) { drawCalibration(); return; }

  generateStars();
  gPlanetLX = CUBE_CX + sxOff(MIRROR_X ? -(PX - DESIGN_CX) : (PX - DESIGN_CX));
  gPlanetLY = CUBE_CY + sxOff(PY - DESIGN_CY);
  drawPlanetAt(gPlanetLX, gPlanetLY);
}

void loop() {
  if (CALIBRATE) { delay(100); return; }

  unsigned long now = millis();
  float gAngle = now * (ROT_DEG_PER_SEC * PI / 180000.0f);
  float ca = cosf(gAngle), sa = sinf(gAngle);

  // ── Stars: offset from DESIGN centre, rotate, scale, place at the CUBE centre ──
  for (int i = 0; i < NUM_STARS; i++) {
    Star& s = stars[i];
    float dx = s.x - DESIGN_CX;
    float dy = s.y - DESIGN_CY;
    float rx = dx * ca - dy * sa;
    float ry = dx * sa + dy * ca;
    if (MIRROR_X) rx = -rx;                       // pre-flip for the cube reflection
    int16_t drawX = CUBE_CX + sxOff(rx);
    int16_t drawY = CUBE_CY + sxOff(ry);

    uint16_t phase = (uint16_t)((now + s.offset) % s.period);
    bool on = phase < ((uint32_t)s.period * s.duty / 100);

    bool needsSpin = false;
    if (s.kind == BRIGHT) {
      bool newCross = (((now + s.spinOffset) / s.spinPeriod) % 2) == 0;
      if (newCross != s.spinCross) { s.spinCross = newCross; needsSpin = s.lastOn; }
    }

    bool moved = (drawX != s.lx || drawY != s.ly);
    bool stateChanged = (on != s.lastOn);
    if (moved || stateChanged || needsSpin) {
      if (s.lastOn) eraseStar(s.lx, s.ly, s.kind);
      if (on)       drawStar(drawX, drawY, s.kind, starColor(s.kind), s.spinCross);
      s.lx = drawX; s.ly = drawY; s.lastOn = on;
    }
  }

  // ── Planet: same transform around the cube centre ──────────────────────────
  float pdx = PX - DESIGN_CX, pdy = PY - DESIGN_CY;
  float prx = pdx * ca - pdy * sa;
  float pry = pdx * sa + pdy * ca;
  if (MIRROR_X) prx = -prx;
  int16_t newPX = CUBE_CX + sxOff(prx);
  int16_t newPY = CUBE_CY + sxOff(pry);
  if (newPX != gPlanetLX || newPY != gPlanetLY) {
    tft.fillCircle(gPlanetLX, gPlanetLY, 9, COL_BG);
    drawPlanetAt(newPX, newPY);
    gPlanetLX = newPX; gPlanetLY = newPY;
  }

  delay(35);
}
