// All 77 districts of Nepal organized by provinces

export const nepalDistricts = {
  // Province 1 (Koshi Province) - 14 districts
  'Koshi Province': [
    'Bhojpur',
    'Dhankuta',
    'Ilam',
    'Jhapa',
    'Khotang',
    'Morang',
    'Okhaldhunga',
    'Panchthar',
    'Sankhuwasabha',
    'Solukhumbu',
    'Sunsari',
    'Taplejung',
    'Terhathum',
    'Udayapur',
  ],

  // Province 2 (Madhesh Province) - 8 districts
  'Madhesh Province': [
    'Bara',
    'Dhanusha',
    'Mahottari',
    'Parsa',
    'Rautahat',
    'Saptari',
    'Sarlahi',
    'Siraha',
  ],

  // Bagmati Province - 13 districts
  'Bagmati Province': [
    'Bhaktapur',
    'Chitwan',
    'Dhading',
    'Dolakha',
    'Kathmandu',
    'Kavrepalanchok',
    'Lalitpur',
    'Makwanpur',
    'Nuwakot',
    'Ramechhap',
    'Rasuwa',
    'Sindhuli',
    'Sindhupalchok',
  ],

  // Gandaki Province - 11 districts
  'Gandaki Province': [
    'Baglung',
    'Gorkha',
    'Kaski',
    'Lamjung',
    'Manang',
    'Mustang',
    'Myagdi',
    'Nawalpur',
    'Parbat',
    'Syangja',
    'Tanahun',
  ],

  // Lumbini Province - 12 districts
  'Lumbini Province': [
    'Arghakhanchi',
    'Banke',
    'Bardiya',
    'Dang',
    'Gulmi',
    'Kapilvastu',
    'Palpa',
    'Parasi',
    'Pyuthan',
    'Rolpa',
    'Rukum East',
    'Rupandehi',
  ],

  // Karnali Province - 10 districts
  'Karnali Province': [
    'Dailekh',
    'Dolpa',
    'Humla',
    'Jajarkot',
    'Jumla',
    'Kalikot',
    'Mugu',
    'Rukum West',
    'Salyan',
    'Surkhet',
  ],

  // Sudurpashchim Province - 9 districts
  'Sudurpashchim Province': [
    'Achham',
    'Baitadi',
    'Bajhang',
    'Bajura',
    'Dadeldhura',
    'Darchula',
    'Doti',
    'Kailali',
    'Kanchanpur',
  ],
};

// Flatten all districts into a single array
export const allDistricts = Object.values(nepalDistricts).flat();

// Get districts by province
export const getDistrictsByProvince = (province: string): string[] => {
  return nepalDistricts[province as keyof typeof nepalDistricts] || [];
};

// Get province by district
export const getProvinceByDistrict = (district: string): string | null => {
  for (const [province, districts] of Object.entries(nepalDistricts)) {
    if (districts.includes(district)) {
      return province;
    }
  }
  return null;
};

// Total count verification
export const totalDistricts = allDistricts.length; // Should be 77
