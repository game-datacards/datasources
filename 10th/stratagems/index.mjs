import core from './core.mjs';
import adeptasororitas from './adeptasororitas.mjs';
import adeptuscustodes from './adeptuscustodes.mjs';
import adeptusmechanicus from './adeptusmechanicus.mjs';
import aeldari from './aeldari.mjs';
import astramilitarum from './astramilitarum.mjs';
import blacktemplar from './blacktemplar.mjs';
import bloodangels from './bloodangels.mjs';
import chaos_spacemarines from './chaos_spacemarines.mjs';

import chaosknights from './chaosknights.mjs';
import imperialknights from './imperialknights.mjs';
import space_marines from './space_marines.mjs';

const data = {
  core,
  // key names should match the file names for generated json.gdc (with the exception of core above)
  adeptasororitas,
  adeptuscustodes,
  adeptusmechanicus,
  aeldari,
  astramilitarum,
  blacktemplar,
  bloodangels,
  chaos_spacemarines,

  chaosknights,
  imperialknights,
  space_marines,
}

export default data;