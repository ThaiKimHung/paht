const conPi = Math.PI,
  dXS = 11.554526734645687 - 11.553516370000068,
  dYS = 106.15849326484644 - 106.16027463500006,
  Ktt = 105.5;

export function convertLatLonToXY(coordinate) {
  coordinate.latitude = coordinate.latitude + dXS;
  coordinate.longitude = coordinate.longitude + dYS;
  coordinate.latitude = (conPi * coordinate.latitude) / 180;
  coordinate.longitude = (conPi * coordinate.longitude) / 180;

  let KTT = (Ktt * conPi) / 180,
    f = 1 / 298.257223563,
    a = 6378137.0,
    b = (1 - f) * a,
    K = 0.9999,
    m_a = a * K,
    m_b = b * K,
    m_e2 = (m_a * m_a - m_b * m_b) / (m_a * m_a),
    m_N = (m_a - m_b) / (m_a + m_b),
    m_pow2N = m_N * m_N,
    m_pow3N = m_N * m_pow2N,
    sinphi = Math.sin(coordinate.latitude),
    cosphi = Math.cos(coordinate.latitude),
    tanphi = Math.tan(coordinate.latitude),
    pow2sinphi = sinphi * sinphi,
    pow2cosphi = cosphi * cosphi,
    pow3cosphi = pow2cosphi * cosphi,
    pow5cosphi = pow3cosphi * pow2cosphi,
    pow2tanphi = tanphi * tanphi,
    pow4tanphi = pow2tanphi * pow2tanphi,
    v = m_a / Math.sqrt(1.0 - m_e2 * pow2sinphi),
    rho = (v * (1.0 - m_e2)) / (1.0 - m_e2 * pow2sinphi),
    n2 = v / rho - 1.0,
    phi1 = 0,
    phi = coordinate.latitude,
    M =
      m_b *
      ((1.0 + m_N + (m_pow2N * 5.0) / 4.0 + (m_pow3N * 5.0) / 4.0) *
        (phi - phi1) -
        (3.0 * m_N + 3.0 * m_pow2N + (m_pow3N * 21.0) / 8.0) *
          Math.sin(phi - phi1) *
          Math.cos(phi + phi1) +
        ((m_pow2N * 15.0) / 8.0 + (m_pow3N * 15.0) / 8.0) *
          Math.sin(2.0 * (phi - phi1)) *
          Math.cos(2.0 * (phi + phi1)) -
        ((m_pow3N * 35.0) / 24.0) *
          Math.sin(3.0 * (phi - phi1)) *
          Math.cos(3.0 * (phi + phi1))),
    P = coordinate.longitude - KTT,
    //toi uu hoa
    pow2P = P * P,
    pow3P = pow2P * P,
    pow4P = pow2P * pow2P,
    pow5P = pow4P * P,
    pow6P = pow2P * pow4P,
    //Tinh chuyen gia tri X
    DolechX = 0,
    II = (v / 2.0) * sinphi * cosphi,
    III = (v / 24.0) * sinphi * pow3cosphi * (5.0 - pow2tanphi + 9.0 * n2),
    IIIA =
      (v / 720.0) *
      sinphi *
      pow5cosphi *
      (61.0 - 58.0 * pow2tanphi + pow4tanphi),
    X = DolechX + M + pow2P * II + pow4P * III + pow6P * IIIA,
    // Tinh chuyen gia tri Y
    DolechY = 500000,
    IV = v * cosphi,
    v1 = (v / 6.0) * pow3cosphi * (v / rho - pow2tanphi),
    VI =
      (v1 / 120.0) *
      pow5cosphi *
      (5.0 -
        18.0 * pow2tanphi +
        pow4tanphi +
        14.0 * n2 -
        58.0 * pow2tanphi * n2),
    Y = DolechY + P * IV + pow3P * v1 + pow5P * VI;
  return {x: X, y: Y};
}

export function convertXYToLatLon(pointXY, route) {
  let m_dSemiMajorAxis = 6378137.0,
    fff = 1 / 298.257223563,
    m_dSemiMinorAxis = (1 - fff) * m_dSemiMajorAxis,
    m_dLatitudeOrigin = 0,
    m_dLongitudeOrigin = Ktt,
    m_dFalseNorthing = 0,
    m_dFalseEasting = 500000,
    m_dScaleFactorAtOrigin = 0.9999,
    m_a = m_dSemiMajorAxis * m_dScaleFactorAtOrigin,
    m_b = m_dSemiMinorAxis * m_dScaleFactorAtOrigin,
    m_e2 = (m_a * m_a - m_b * m_b) / (m_a * m_a),
    m_N = (m_a - m_b) / (m_a + m_b),
    m_pow2N = m_N * m_N,
    m_pow3N = m_N * m_pow2N,
    northing = pointXY.x,
    easting = pointXY.y,
    PI = Math.PI,
    phiDash =
      (northing - m_dFalseNorthing) / m_a + (m_dLatitudeOrigin * PI) / 180,
    phi = phiDash,
    phi1 = (m_dLatitudeOrigin * PI) / 180,
    M =
      m_b *
      ((1 + m_N + (m_pow2N * 5) / 4 + (m_pow3N * 5) / 4) * (phi - phi1) -
        (3 * m_N + 3 * m_pow2N + (m_pow3N * 21) / 8) *
          Math.sin(phi - phi1) *
          Math.cos(phi + phi1) +
        ((m_pow2N * 15) / 8 + (m_pow3N * 15) / 8) *
          Math.sin(2 * (phi - phi1)) *
          Math.cos(2 * (phi + phi1)) -
        ((m_pow3N * 35) / 24) *
          Math.sin(3 * (phi - phi1)) *
          Math.cos(3 * (phi + phi1)));

  while (northing - m_dFalseNorthing - M > 0.001) {
    phi = phi + (northing - m_dFalseNorthing - M) / m_a;
    M =
      m_b *
      ((1 + m_N + (m_pow2N * 5) / 4 + (m_pow3N * 5) / 4) * (phi - phi1) -
        (3 * m_N + 3 * m_pow2N + (m_pow3N * 21) / 8) *
          Math.sin(phi - phi1) *
          Math.cos(phi + phi1) +
        ((m_pow2N * 15) / 8 + (m_pow3N * 15) / 8) *
          Math.sin(2 * (phi - phi1)) *
          Math.cos(2 * (phi + phi1)) -
        ((m_pow3N * 35) / 24) *
          Math.sin(3 * (phi - phi1)) *
          Math.cos(3 * (phi + phi1)));
  }
  let v = m_a / Math.sqrt(1 - m_e2 * Math.pow(Math.sin(phi), 2)),
    rho = (v * (1 - m_e2)) / (1 - m_e2 * Math.pow(Math.sin(phi), 2)),
    n2 = v / rho - 1,
    VII = Math.tan(phi) / (2 * rho * v),
    VIII =
      (Math.tan(phi) / (24 * rho * Math.pow(v, 3))) *
      (5 +
        3 * Math.pow(Math.tan(phi), 2) +
        n2 -
        9 * n2 * Math.pow(Math.tan(phi), 2)),
    IX =
      (Math.tan(phi) / (720 * rho * Math.pow(v, 5))) *
      (61 + 90 * Math.pow(Math.tan(phi), 2) + 45 * Math.pow(Math.tan(phi), 4)),
    Et = easting - m_dFalseEasting,
    latitude =
      ((phi -
        Math.pow(Et, 2) * VII +
        Math.pow(Et, 4) * VIII -
        Math.pow(Et, 6) * IX) *
        180) /
      PI,
    X = 1 / Math.cos(phi) / v,
    XI =
      (1 / Math.cos(phi) / (6 * Math.pow(v, 3))) *
      (v / rho + 2 * Math.pow(Math.tan(phi), 2)),
    XII =
      (1 / Math.cos(phi) / (120 * Math.pow(v, 5))) *
      (5 + 28 * Math.pow(Math.tan(phi), 2) + 24 * Math.pow(Math.tan(phi), 4)),
    XIIA =
      (1 / Math.cos(phi) / (5040 * Math.pow(v, 7))) *
      (61 +
        662 * Math.pow(Math.tan(phi), 2) +
        1320 * Math.pow(Math.tan(phi), 4) +
        720 * Math.pow(Math.tan(phi), 6)),
    longitude =
      m_dLongitudeOrigin +
      ((Et * X -
        Math.pow(Et, 3) * XI +
        Math.pow(Et, 5) * XII -
        Math.pow(Et, 7) * XIIA) *
        180) /
        PI,
    dxQH = 11.554384196871565 - 11.553257,
    dyQH = 106.1614208513566 - 106.163286;

  if (route === 'quyhoach') {
    latitude = latitude - dxQH;
    longitude = longitude - dyQH;
  } else {
    latitude = latitude - dXS;
    longitude = longitude - dYS;
  }

  return {latitude: latitude, longitude: longitude};
}

export function getDistance(p1, p2) {
  let p = 0.017453292519943295; // Math.PI / 180
  let c = Math.cos;
  let a =
    0.5 -
    c((p1.latitude - p2.latitude) * p) / 2 +
    (c(p2.latitude * p) *
      c(p1.latitude * p) *
      (1 - c((p1.longitude - p2.longitude) * p))) /
      2;
  // 2 * R; R = 6371 km
  return (12742 * Math.asin(Math.sqrt(a)) * 1000).toFixed(1); //meter
}

export function checkInside(point, polygon) {
  let x = point.latitude,
    y = point.longitude;

  let inside = false;
  let i, j;
  for (i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i].latitude,
      yi = polygon[i].longitude;
    let xj = polygon[j].latitude,
      yj = polygon[j].longitude;

    let intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

export function calcArea(locations) {

  if (!locations.length) {
    return 0;
  }
  if (locations.length < 3) {
    return 0;
  }
  let radius = 6371000;

  const diameter = radius * 2;
  const circumference = diameter * Math.PI;
  const listY = [];
  const listX = [];
  const listArea = [];
  // calculate segment x and y in degrees for each point

  const latitudeRef = locations[0].latitude;
  const longitudeRef = locations[0].longitude;
  for (let i = 1; i < locations.length; i++) {
    let latitude = locations[i].latitude;
    let longitude = locations[i].longitude;
    listY.push(calculateYSegment(latitudeRef, latitude, circumference));

    listX.push(calculateXSegment(longitudeRef, longitude, latitude, circumference));

  }

  // calculate areas for each triangle segment
  for (let i = 1; i < listX.length; i++) {
    let x1 = listX[i - 1];
    let y1 = listY[i - 1];
    let x2 = listX[i];
    let y2 = listY[i];
    listArea.push(calculateAreaInSquareMeters(x1, x2, y1, y2));

  }

  let areasSum = 0;
  listArea.forEach(area => areasSum = areasSum + area)

  return Math.abs(areasSum);
}

function calculateAreaInSquareMeters(x1, x2, y1, y2) {
  return (y1 * x2 - x1 * y2) / 2;
}

function calculateYSegment(latitudeRef, latitude, circumference) {
  return (latitude - latitudeRef) * circumference / 360.0;
}

function calculateXSegment(longitudeRef, longitude, latitude, circumference)     {
  return (longitude - longitudeRef) * circumference * Math.cos((latitude * (Math.PI / 180))) / 360.0;
}
