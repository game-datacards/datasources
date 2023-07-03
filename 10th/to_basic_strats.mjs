import fs from 'fs';
import { v5 as uuidv5 } from 'uuid';
import data from './stratagems/index.mjs';

const core = {
  id: 'basic',
  link: 'https://game-datacards.eu',
  name: 'Basic',
  is_subfaction: false,
  parent_id: '',
  stratagems: data['core'].map((val) => {
    return { ...val, id: uuidv5(val.name, '142f2423-fe2c-4bd3-96b9-fb4ef1ceb92e') };
  }),
};

fs.writeFileSync(`./gdc/core.json`, JSON.stringify(core, null, 2));
