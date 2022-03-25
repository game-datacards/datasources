
rm -rf ./*.csv
wget http://wahapedia.ru/wh40k9ed/Abilities.csv
wget http://wahapedia.ru/wh40k9ed/Datasheets.csv
wget http://wahapedia.ru/wh40k9ed/Datasheets_abilities.csv
wget http://wahapedia.ru/wh40k9ed/Datasheets_damage.csv
wget http://wahapedia.ru/wh40k9ed/Datasheets_keywords.csv
wget http://wahapedia.ru/wh40k9ed/Datasheets_models.csv
wget http://wahapedia.ru/wh40k9ed/Datasheets_options.csv
wget http://wahapedia.ru/wh40k9ed/Datasheets_stratagems.csv
wget http://wahapedia.ru/wh40k9ed/Datasheets_wargear.csv
wget http://wahapedia.ru/wh40k9ed/Factions.csv
wget http://wahapedia.ru/wh40k9ed/PsychicPowers.csv
wget http://wahapedia.ru/wh40k9ed/Source.csv
wget http://wahapedia.ru/wh40k9ed/StratagemPhases.csv
wget http://wahapedia.ru/wh40k9ed/Stratagems.csv
wget http://wahapedia.ru/wh40k9ed/Wargear.csv
wget http://wahapedia.ru/wh40k9ed/Wargear_list.csv
wget http://wahapedia.ru/wh40k9ed/Warlord_traits.csv

node ./convert_csv.js