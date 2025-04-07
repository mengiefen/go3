const mappedTimezones = [
  {
    name: "International Date Line West", 
    caption: "(GMT-12:00) International Date Line West",
    momentName: null
  },
  {
    name: "American Samoa", 
    caption: "(GMT-11:00) American Samoa",
    momentName: "Pacific/Samoa"
  },
  {
    name: "Midway Island", 
    caption: "(GMT-11:00) Midway Island",
    momentName: "Pacific/Midway"
  },
  {
    name: "Hawaii", 
    caption: "(GMT-10:00) Hawaii",
    momentName: "US/Hawaii"
  },
  {
    name: "Alaska", 
    caption: "(GMT-09:00) Alaska",
    momentName: "US/Alaska"
  },
  {
    name: "Pacific Time (US & Canada)", 
    caption: "(GMT-08:00) Pacific Time (US & Canada)",
    momentName: "US/Pacific"
  },
  {
    name: "Tijuana", 
    caption: "(GMT-08:00) Tijuana",
    momentName: "America/Tijuana"
  },
  {
    name: "Arizona", 
    caption: "(GMT-07:00) Arizona",
    momentName: "US/Arizona"
  },
  {
    name: "Chihuahua", 
    caption: "(GMT-07:00) Chihuahua",
    momentName: "America/Chihuahua"
  },
  {
    name: "Mazatlan", 
    caption: "(GMT-07:00) Mazatlan",
    momentName: "America/Mazatlan"
  },
  {
    name: "Mountain Time (US & Canada)", 
    caption: "(GMT-07:00) Mountain Time (US & Canada)", 
    momentName: "US/Mountain"
  },
  {
    name: "Central America", 
    caption: "(GMT-06:00) Central America",
    momentName: "US/Central" 
  },
  {
    name: "Central Time (US & Canada)", 
    caption: "(GMT-06:00) Central Time (US & Canada)",
    momentName: "US/Central"
  },
  {
    name: "Guadalajara", 
    caption: "(GMT-06:00) Guadalajara",
    momentName: "America/Mexico_City"
  },
  {
    name: "Mexico City", 
    caption: "(GMT-06:00) Mexico City",
    momentName: "America/Mexico_City"
  },
  {
    name: "Monterrey", 
    caption: "(GMT-06:00) Monterrey",
    momentName: "America/Monterrey"
  },
  {
    name: "Saskatchewan", 
    caption: "(GMT-06:00) Saskatchewan",
    momentName: "Canada/Saskatchewan"
  },
  {
    name: "Bogota", 
    caption: "(GMT-05:00) Bogota",
    momentName: "America/Bogota"
  },
  {
    name: "Eastern Time (US & Canada)", 
    caption: "(GMT-05:00) Eastern Time (US & Canada)",
    momentName: "US/Eastern"
  },
  {
    name: "Indiana (East)", 
    caption: "(GMT-05:00) Indiana (East)",
    momentName: "US/East-Indiana"
  },
  {
    name: "Lima", 
    caption: "(GMT-05:00) Lima",
    momentName: "America/Lima"
  },
  {
    name: "Quito", 
    caption: "(GMT-05:00) Quito",
    momentName: "America/Guayaquil"
  },
  {
    name: "Atlantic Time (Canada)", 
    caption: "(GMT-04:00) Atlantic Time (Canada)",
    momentName: "Canada/Atlantic"
  },
  {
    name: "Caracas", 
    caption: "(GMT-04:00) Caracas",
    momentName: "America/Caracas"
  },
  {
    name: "Georgetown", 
    caption: "(GMT-04:00) Georgetown",
    momentName: "America/Guyana"
  },
  {
    name: "La Paz", 
    caption: "(GMT-04:00) La Paz",
    momentName: "America/La_Paz"
  },
  {
    name: "Puerto Rico", 
    caption: "(GMT-04:00) Puerto Rico",
    momentName: "America/Puerto_Rico"
  },
  {
    name: "Santiago", 
    caption: "(GMT-04:00) Santiago",
    momentName: "America/Santiago"
  },
  {
    name: "Newfoundland", 
    caption: "(GMT-03:30) Newfoundland",
    momentName: "Canada/Newfoundland"
  },
  {
    name: "Brasilia", 
    caption: "(GMT-03:00) Brasilia",
    momentName: "America/Sao_Paulo"
  },
  {
    name: "Buenos Aires", 
    caption: "(GMT-03:00) Buenos Aires",
    momentName: "America/Buenos_Aires"
  },
  {
    name: "Greenland", 
    caption: "(GMT-03:00) Greenland",
    momentName: "America/Thule"
  },
  {
    name: "Montevideo", 
    caption: "(GMT-03:00) Montevideo",
    momentName: "America/Montevideo"
  },
  {
    name: "Mid-Atlantic", 
    caption: "(GMT-02:00) Mid-Atlantic",
    momentName: null
  },
  {
    name: "Azores", 
    caption: "(GMT-01:00) Azores",
    momentName: "Atlantic/Azores"
  },
  {
    name: "Cape Verde Is.", 
    caption: "(GMT-01:00) Cape Verde Is.",
    momentName: "Atlantic/Cape_Verde"
  },
  {
    name: "Edinburgh", 
    caption: "(GMT+00:00) Edinburgh",
    momentName: "Europe/London"
  },
  {
    name: "Lisbon", 
    caption: "(GMT+00:00) Lisbon",
    momentName: "Europe/Lisbon"
  },
  {
    name: "London", 
    caption: "(GMT+00:00) London",
    momentName: "Europe/London"
  },
  {
    name: "Monrovia", 
    caption: "(GMT+00:00) Monrovia",
    momentName: "Africa/Monrovia"
  },
  {
    name: "UTC", 
    caption: "(GMT+00:00) UTC",
    momentName: "UTC"
  },
  {
    name: "Amsterdam", 
    caption: "(GMT+01:00) Amsterdam",
    momentName: "Europe/Amsterdam"
  },
  {
    name: "Belgrade", 
    caption: "(GMT+01:00) Belgrade",
    momentName: "Europe/Belgrade"
  },
  {
    name: "Berlin", 
    caption: "(GMT+01:00) Berlin",
    momentName: "Europe/Berlin"
  },
  {
    name: "Bern", 
    caption: "(GMT+01:00) Bern",
    momentName: "Europe/Zurich"
  },
  {
    name: "Bratislava", 
    caption: "(GMT+01:00) Bratislava",
    momentName: "Europe/Bratislava"
  },
  {
    name: "Brussels", 
    caption: "(GMT+01:00) Brussels",
    momentName: "Europe/Brussels"    
  },
  {
    name: "Budapest", 
    caption: "(GMT+01:00) Budapest",
    momentName: "Europe/Budapest"
  },
  {
    name: "Casablanca", 
    caption: "(GMT+01:00) Casablanca",
    momentName: "Africa/Casablanca"
  },
  {
    name: "Copenhagen", 
    caption: "(GMT+01:00) Copenhagen",
    momentName: "Europe/Copenhagen"
  },
  {
    name: "Dublin", 
    caption: "(GMT+01:00) Dublin",
    momentName: "Europe/Dublin"
  },
  {
    name: "Ljubljana", 
    caption: "(GMT+01:00) Ljubljana",
    momentName: "Europe/Ljubljana"
  },
  {
    name: "Madrid", 
    caption: "(GMT+01:00) Madrid",
    momentName: "Europe/Madrid"
  },
  {
    name: "Paris", 
    caption: "(GMT+01:00) Paris",
    momentName: "Europe/Paris"
  },
  {
    name: "Prague", 
    caption: "(GMT+01:00) Prague",
    momentName: "Europe/Prague"
  },
  {
    name: "Rome", 
    caption: "(GMT+01:00) Rome",
    momentName: "Europe/Rome"
  },
  {
    name: "Sarajevo", 
    caption: "(GMT+01:00) Sarajevo",
    momentName: "Europe/Sarajevo"
  },
  {
    name: "Skopje", 
    caption: "(GMT+01:00) Skopje",
    momentName: "Europe/Skopje"
  },
  {
    name: "Stockholm", 
    caption: "(GMT+01:00) Stockholm",
    momentName: "Europe/Stockholm"
  },
  {
    name: "Vienna", 
    caption: "(GMT+01:00) Vienna",
    momentName: "Europe/Vienna"
  },
  {
    name: "Warsaw", 
    caption: "(GMT+01:00) Warsaw",
    momentName: "Europe/Warsaw"
  },
  {
    name: "West Central Africa", 
    caption: "(GMT+01:00) West Central Africa",
    momentName: null
  },
  {
    name: "Zagreb", 
    caption: "(GMT+01:00) Zagreb",
    momentName: "Europe/Zagreb"
  },
  {
    name: "Zurich", 
    caption: "(GMT+01:00) Zurich",
    momentName: "Europe/Zurich"
  },
  {
    name: "Athens", 
    caption: "(GMT+02:00) Athens",
    momentName: "Europe/Athens"
  },
  {
    name: "Bucharest", 
    caption: "(GMT+02:00) Bucharest",
    momentName: "Europe/Bucharest"
  },
  {
    name: "Cairo", 
    caption: "(GMT+02:00) Cairo",
    momentName: "Africa/Cairo"
  },
  {
    name: "Harare", 
    caption: "(GMT+02:00) Harare",
    momentName: "Africa/Harare"
  },
  {
    name: "Helsinki", 
    caption: "(GMT+02:00) Helsinki",
    momentName: "Europe/Helsinki"
  },
  {
    name: "Jerusalem", 
    caption: "(GMT+02:00) Jerusalem",
    momentName: "Asia/Jerusalem"
  },
  {
    name: "Kaliningrad", 
    caption: "(GMT+02:00) Kaliningrad",
    momentName: "Europe/Kaliningrad"
  },
  {
    name: "Kyiv", 
    caption: "(GMT+02:00) Kyiv",
    momentName: "Europe/Kyiv"
  },
  {
    name: "Pretoria", 
    caption: "(GMT+02:00) Pretoria",
    momentName: "Africa/Johannesburg"
  },
  {
    name: "Riga", 
    caption: "(GMT+02:00) Riga",
    momentName: "Europe/Riga"
  },
  {
    name: "Sofia", 
    caption: "(GMT+02:00) Sofia",
    momentName: "Europe/Sofia"
  },
  {
    name: "Tallinn", 
    caption: "(GMT+02:00) Tallinn",
    momentName: "Europe/Tallinn"
  },
  {
    name: "Vilnius", 
    caption: "(GMT+02:00) Vilnius",
    momentName: "Europe/Vilnius"
  },
  {
    name: "Baghdad", 
    caption: "(GMT+03:00) Baghdad",
    momentName: "Asia/Baghdad"
  },
  {
    name: "Istanbul", 
    caption: "(GMT+03:00) Istanbul",
    momentName: "Asia/Istanbul"
  },
  {
    name: "Kuwait", 
    caption: "(GMT+03:00) Kuwait",
    momentName: "Asia/Kuwait"
  },
  {
    name: "Minsk", 
    caption: "(GMT+03:00) Minsk", 
    momentName: "Europe/Minsk"
  },
  {
    name: "Moscow", 
    caption: "(GMT+03:00) Moscow",
    momentName: "Europe/Moscow"
  },
  {
    name: "Nairobi", 
    caption: "(GMT+03:00) Nairobi",
    momentName: "Africa/Nairobi"
  },
  {
    name: "Riyadh", 
    caption: "(GMT+03:00) Riyadh",
    momentName: "Asia/Riyadh"
  },
  {
    name: "St. Petersburg", 
    caption: "(GMT+03:00) St. Petersburg",
    momentName: "Europe/Moscow" 
  },
  {
    name: "Tehran", 
    caption: "(GMT+03:30) Tehran",
    momentName: "Asia/Tehran"
  },
  {
    name: "Abu Dhabi", 
    caption: "(GMT+04:00) Abu Dhabi", 
    momentName: "Asia/Dubai"
  },
  {
    name: "Baku", 
    caption: "(GMT+04:00) Baku",
    momentName: "Asia/Baku"
  },
  {
    name: "Muscat", 
    caption: "(GMT+04:00) Muscat",
    momentName: "Asia/Muscat"
  },
  {
    name: "Samara", 
    caption: "(GMT+04:00) Samara", 
    momentName: "Europe/Samara"
  },
  {
    name: "Tbilisi", 
    caption: "(GMT+04:00) Tbilisi",
    momentName: "Asia/Tbilisi"
  },
  {
    name: "Volgograd", 
    caption: "(GMT+04:00) Volgograd",
    momentName: "Europe/Volgograd"
  },
  {
    name: "Yerevan", 
    caption: "(GMT+04:00) Yerevan",
    momentName: "Asia/Yerevan"
  },
  {
    name: "Kabul", 
    caption: "(GMT+04:30) Kabul",
    momentName: "Asia/Kabul"
  },
  {
    name: "Ekaterinburg", 
    caption: "(GMT+05:00) Ekaterinburg",
    momentName: "Asia/Yekaterinburg"
  },
  {
    name: "Islamabad", 
    caption: "(GMT+05:00) Islamabad",
    momentName: "Asia/Karachi"
  },
  {
    name: "Karachi", 
    caption: "(GMT+05:00) Karachi",
    momentName: "Asia/Karachi"
  },
  {
    name: "Tashkent", 
    caption: "(GMT+05:00) Tashkent",
    momentName: "Asia/Tashkent"
  },
  {
    name: "Chennai", 
    caption: "(GMT+05:30) Chennai",
    momentName: "Asia/Kolkata"
  },
  {
    name: "Kolkata", 
    caption: "(GMT+05:30) Kolkata",
    momentName: "Asia/Kolkata"
  },
  {
    name: "Mumbai", 
    caption: "(GMT+05:30) Mumbai",
    momentName: "Asia/Kolkata"
  },
  {
    name: "New Delhi", 
    caption: "(GMT+05:30) New Delhi",
    momentName: "Asia/Kolkata"
  },
  {
    name: "Sri Jayawardenepura", 
    caption: "(GMT+05:30) Sri Jayawardenepura",
    momentName: "Asia/Colombo"
  },
  {
    name: "Kathmandu", 
    caption: "(GMT+05:45) Kathmandu", 
    momentName: "Asia/Kathmandu"
  },
  {
    name: "Almaty", 
    caption: "(GMT+06:00) Almaty",
    momentName: "Asia/Almaty"
  },
  {
    name: "Astana", 
    caption: "(GMT+06:00) Astana",
    momentName: "Asia/Almaty"
  },
  {
    name: "Dhaka", 
    caption: "(GMT+06:00) Dhaka",
    momentName: "Asia/Dhaka"
  },
  {
    name: "Urumqi", 
    caption: "(GMT+06:00) Urumqi",
    momentName: "Asia/Urumqi"
  },
  {
    name: "Rangoon", 
    caption: "(GMT+06:30) Rangoon",
    momentName: "Asia/Rangoon"
  },
  {
    name: "Bangkok", 
    caption: "(GMT+07:00) Bangkok",
    momentName: "Asia/Bangkok"
  },
  {
    name: "Hanoi", 
    caption: "(GMT+07:00) Hanoi",
    momentName: "Asia/Ho_Chi_Minh"
  },
  {
    name: "Jakarta", 
    caption: "(GMT+07:00) Jakarta", 
    momentName: "Asia/Jakarta"
  },
  {
    name: "Krasnoyarsk", 
    caption: "(GMT+07:00) Krasnoyarsk", 
    momentName: "Asia/Krasnoyarsk"
  },
  {
    name: "Novosibirsk", 
    caption: "(GMT+07:00) Novosibirsk",
    momentName: "Asia/Novosibirsk"
  },
  {
    name: "Beijing", 
    caption: "(GMT+08:00) Beijing",
    momentName: "Asia/Shanghai"
  },
  {
    name: "Chongqing", 
    caption: "(GMT+08:00) Chongqing",
    momentName: "Asia/Chongqing"
  },
  {
    name: "Hong Kong", 
    caption: "(GMT+08:00) Hong Kong",
    momentName: "Asia/Hong_Kong"
  },
  {
    name: "Irkutsk", 
    caption: "(GMT+08:00) Irkutsk",
    momentName: "Asia/Irkutsk"
  },
  {
    name: "Kuala Lumpur", 
    caption: "(GMT+08:00) Kuala Lumpur",
    momentName: "Asia/Kuala_Lumpur"
  },
  {
    name: "Perth", 
    caption: "(GMT+08:00) Perth",
    momentName: "Australia/Perth"
  },
  {
    name: "Singapore", 
    caption: "(GMT+08:00) Singapore",
    momentName: "Asia/Singapore"
  },
  {
    name: "Taipei", 
    caption: "(GMT+08:00) Taipei",
    momentName: "Asia/Taipei"
  },
  {
    name: "Ulaanbaatar", 
    caption: "(GMT+08:00) Ulaanbaatar",
    momentName: "Asia/Ulaanbaatar"
  },
  {
    name: "Osaka", 
    caption: "(GMT+09:00) Osaka",
    momentName: "Asia/Tokyo"
  },
  {
    name: "Sapporo", 
    caption: "(GMT+09:00) Sapporo",
    momentName: "Asia/Tokyo"
  },
  {
    name: "Seoul", 
    caption: "(GMT+09:00) Seoul",
    momentName: "Asia/Seoul"
  },
  {
    name: "Tokyo", 
    caption: "(GMT+09:00) Tokyo",
    momentName: "Asia/Tokyo"
  },
  {
    name: "Yakutsk", 
    caption: "(GMT+09:00) Yakutsk",
    momentName: "Asia/Yakutsk"
  },
  {
    name: "Adelaide", 
    caption: "(GMT+09:30) Adelaide",
    momentName: "Australia/Adelaide"
  },
  {
    name: "Darwin", 
    caption: "(GMT+09:30) Darwin",
    momentName: "Australia/Darwin"
  },
  {
    name: "Brisbane", 
    caption: "(GMT+10:00) Brisbane",
    momentName: "Australia/Brisbane"
  },
  {
    name: "Canberra", 
    caption: "(GMT+10:00) Canberra",
    momentName: "Australia/Canberra"
  },
  {
    name: "Guam", 
    caption: "(GMT+10:00) Guam",
    momentName: "Pacific/Guam"
  },
  {
    name: "Hobart", 
    caption: "(GMT+10:00) Hobart",
    momentName: "Australia/Hobart"
  },
  {
    name: "Melbourne", 
    caption: "(GMT+10:00) Melbourne", 
    momentName: "Australia/Melbourne"
  },
  {
    name: "Port Moresby", 
    caption: "(GMT+10:00) Port Moresby",
    momentName: "Pacific/Port_Moresby"
  },
  {
    name: "Sydney", 
    caption: "(GMT+10:00) Sydney",
    momentName: "Australia/Sydney"
  },
  {
    name: "Vladivostok", 
    caption: "(GMT+10:00) Vladivostok",
    momentName: "Asia/Vladivostok"
  },
  {
    name: "Magadan", 
    caption: "(GMT+11:00) Magadan",
    momentName: "Asia/Magadan"
  },
  {
    name: "New Caledonia", 
    caption: "(GMT+11:00) New Caledonia",
    momentName: "Pacific/Noumea"
  },
  {
    name: "Solomon Is.", 
    caption: "(GMT+11:00) Solomon Is.",
    momentName: "Pacific/Guadalcanal"
  },
  {
    name: "Srednekolymsk", 
    caption: "(GMT+11:00) Srednekolymsk",
    momentName: "Asia/Srednekolymsk"
  },
  {
    name: "Auckland", 
    caption: "(GMT+12:00) Auckland",
    momentName: "Pacific/Auckland"    
  },
  {
    name: "Fiji", 
    caption: "(GMT+12:00) Fiji", 
    momentName: "Pacific/Fiji"
  },
  {
    name: "Kamchatka", 
    caption: "(GMT+12:00) Kamchatka",
    momentName: "Asia/Kamchatka"
  },
  {
    name: "Marshall Is.", 
    caption: "(GMT+12:00) Marshall Is.",
    momentName: "Pacific/Kwajalein"
  },
  {
    name: "Wellington", 
    caption: "(GMT+12:00) Wellington",
    momentName: "Pacific/Auckland"
  },
  {
    name: "Chatham Is.", 
    caption: "(GMT+12:45) Chatham Is.",
    momentName: "Pacific/Chatham"
  },
  {
    name: "Nuku'alofa", 
    caption: "(GMT+13:00) Nuku'alofa",
    momentName: "Pacific/Tongatapu"
  },
  {
    name: "Samoa", 
    caption: "(GMT+13:00) Samoa",
    momentName: "Pacific/Samoa"
  },
  {
    name: "Tokelau Is.", 
    caption: "(GMT+13:00) Tokelau Is.",
    momentName: "Pacific/Fakaofo"
  },
];

const timezones = () => {
  // Don't filter out entries with null momentName to include all timezones
  return mappedTimezones.map(timezone => {
    // For timezones with momentName, get the accurate offset
    let formattedOffset;
    try {
      if (timezone.momentName) {
        formattedOffset = moment.tz(timezone.momentName).format('Z');
      } else {
        // For entries without momentName, extract offset from the caption
        const offsetMatch = timezone.caption.match(/\(GMT([+-]\d{2}:\d{2})\)/);
        formattedOffset = offsetMatch ? offsetMatch[1] : '+00:00';
      }
    } catch (e) {
      // Extract from caption as fallback
      const offsetMatch = timezone.caption.match(/\(GMT([+-]\d{2}:\d{2})\)/);
      formattedOffset = offsetMatch ? offsetMatch[1] : '+00:00';
    }
    
    return {
      name: timezone.name,
      caption: `(GMT${formattedOffset}) ${timezone.name.replace('_', ' ')}`,
      momentName: timezone.momentName
    };
  });
}

// Simplified version of clientTimeZone that focuses just on detection
function clientTimeZone() {
  try {
    // Get available timezones first
    const availableTimezones = timezones();
    
    // Get browser timezone data
    let gmtOffset = new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/)[1];
    let clientGmtOffset = gmtOffset.substring(0,6) + ':' + gmtOffset.substring(6,8);
    let tzInfo = Intl.DateTimeFormat().resolvedOptions();
    let browserTimezone = tzInfo.timeZone; // e.g. "America/New_York"
    let tzParts = browserTimezone.split('/');
    let tzCity = tzParts[tzParts.length-1]?.toLowerCase().replace('_', ' ') || '';
    
    // 1. Try exact match by browser timezone name
    for (let tz of availableTimezones) {
      if (tz.momentName === browserTimezone) {
        return tz;
      }
    }
    
    // 2. Try to find by city name and GMT offset
    let timezoneByCity = availableTimezones.find(tz => 
      tz.caption.includes(clientGmtOffset) && 
      tz.caption.toLowerCase().includes(tzCity)
    );
    
    if (timezoneByCity) return timezoneByCity;
    
    // 3. Try to match by common timezone names
    if (browserTimezone.includes("New_York")) {
      let eastern = availableTimezones.find(tz => tz.name === "Eastern Time (US & Canada)");
      if (eastern) return eastern;
    } else if (browserTimezone.includes("Los_Angeles")) {
      let pacific = availableTimezones.find(tz => tz.name === "Pacific Time (US & Canada)");
      if (pacific) return pacific;
    } else if (browserTimezone.includes("Chicago")) {
      let central = availableTimezones.find(tz => tz.name === "Central Time (US & Canada)");
      if (central) return central;
    }
    
    // 4. Fall back to GMT offset only - find ALL matching timezones with this offset
    let offsetMatches = availableTimezones.filter(tz => tz.caption.includes(clientGmtOffset));
    
    if (offsetMatches.length > 0) {
      // If multiple matches, prefer the most common/general one
      let preferredTimezone = offsetMatches.find(tz => tz.name.includes("Time") && tz.name.includes("&"));
      if (preferredTimezone) return preferredTimezone;
      return offsetMatches[0];
    }
    
    // 5. Default to UTC if nothing else works
    return availableTimezones.find(tz => tz.name === "UTC") || {
      name: "UTC",
      caption: "(GMT+00:00) UTC"
    };
  } catch (error) {
    return {
      name: "UTC",
      caption: "(GMT+00:00) UTC"
    };
  }
}

export { timezones, clientTimeZone, mappedTimezones };