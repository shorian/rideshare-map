// Load Google Maps API
((g) => {
  var h,
    a,
    k,
    p = "The Google Maps JavaScript API",
    c = "google",
    l = "importLibrary",
    q = "__ib__",
    m = document,
    b = window;
  b = b[c] || (b[c] = {});
  var d = b.maps || (b.maps = {}),
    r = new Set(),
    e = new URLSearchParams(),
    u = () =>
      h ||
      (h = new Promise(async (f, n) => {
        await (a = m.createElement("script"));
        e.set("libraries", [...r] + "");
        for (k in g)
          e.set(
            k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()),
            g[k]
          );
        e.set("callback", c + ".maps." + q);
        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
        d[q] = f;
        a.onerror = () => (h = n(Error(p + " could not load.")));
        a.nonce = m.querySelector("script[nonce]")?.nonce || "";
        m.head.append(a);
      }));
  d[l]
    ? console.warn(p + " only loads once. Ignoring:", g)
    : (d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)));
})({
  key: "AIzaSyBwgETEwjmZYnL-SrtoxhArosdL2U1_4fI",
  v: "weekly",
});

const nalandaWest = { lat: 47.654, lng: -122.344 };

const drivers = [
  { name: "Deb", lat: 47.727, lng: -122.331 },
  { name: "Alice", lat: 47.599, lng: -122.308 }
];

const riders = [{ name: "Sid", lat: 47.708, lng: -122.313 }, { name: "Bob", lat: 47.620, lng: -122.314}];

let map;
async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    zoom: 12,
    center: nalandaWest,
    mapId: "map",
  });

  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary(
    "marker"
  );

  new AdvancedMarkerElement({
      map,
      position: nalandaWest,
      content: new PinElement({background: '#f15d22', glyphColor: 'white', borderColor: 'white'}).element,
      title: 'Nalanda West',
    });

  drivers.forEach((driver) => {
    const pin = new PinElement({background: '#59c9e6', glyphColor: 'white', borderColor: 'white'});

    const marker = new AdvancedMarkerElement({
      map,
      position: { lat: driver.lat, lng: driver.lng },
      content: pin.element,
      title: driver.name,
    });

    const info = new google.maps.InfoWindow({
      content: `<strong>${driver.name}</strong>`,
    });

    marker.addListener("click", () => info.open(map, marker));

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      preserveViewport: true
    });

    directionsService.route(
      {
        origin: { lat: driver.lat, lng: driver.lng },
        destination: nalandaWest,
        travelMode: "DRIVING",
      },
      (result, status) => {
        if (status === "OK") directionsRenderer.setDirections(result);
      }
    );
  });

  riders.forEach((rider) => {
    const pin = new PinElement({background: '#3e5878', glyphColor: 'white', borderColor: 'white'});
    const marker = new AdvancedMarkerElement({
      position: { lat: rider.lat, lng: rider.lng },
      map,
      content: pin.element,
      title: rider.name,
    });

    const info = new google.maps.InfoWindow({
      content: `<strong>${rider.name}</strong>`,
    });

    marker.addListener("click", () => info.open(map, marker));
  });
}

initMap();
