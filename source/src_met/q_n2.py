# -*- coding: utf-8 -*-
"""Meteorology B: Foundation and Bridge questions for dh, precip, light, tstorm, winds, torn, hurr, winter, safety, cases."""
import sys,os
sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','src_geo'))
from auth import *
def run():
    # ---------- dh: drought and heat waves ----------
    t='dh'
    SA(t,'F',"A long period with much less rain than normal is called a…",["drought"],["Plants and rivers dry out.","This is a drought."])
    SA(t,'F',"What should you drink more of during a heat wave?",["water"],["Your body loses water by sweating.","Drink water before you feel thirsty."])
    SA(t,'F',"Should you ever leave a child or pet in a parked car on a hot day?",["no","never","no never"],["A parked car heats up very fast, even with windows cracked.","Never leave a child or pet in a car."])
    SA(t,'F',"The condition when the body gets too hot and sweating is not enough is called heat…",["stroke","heat stroke","exhaustion","heat exhaustion"],["Heat exhaustion is the earlier stage.","Heat stroke is an emergency: call 911."],adj=0.1)
    NM(t,'B',"A town normally gets 40 mm of rain in a month but got only 10 mm. What percent of the normal rainfall fell?",25,["Divide: 10 ÷ 40 = 0.25.","0.25 = 25%."],u='%',free=True)
    NM(t,'B',"The heat index makes 35 °C with high humidity feel hotter. If it feels like 41 °C, how many degrees hotter than the air temperature does it feel?",6,["Subtract: 41 − 35.","It feels 6 °C hotter."],u='°C',free=True)
    SA(t,'B',"Why does high humidity make hot weather feel hotter?",["sweat evaporates slowly","sweat does not evaporate","sweat can't evaporate","sweat evaporates less","less evaporation","sweat doesn't evaporate well"],["Sweat cools you only when it evaporates.","Humid air holds more water, so sweat evaporates slowly and cooling is weaker."],adj=0.2)
    SA(t,'B',"A heat dome is a strong area of what kind of pressure that traps hot air?",["high pressure","high","a high"],["Sinking air under a strong high heats up and clouds clear.","The air acts like a lid over the region."])
    SA(t,'B',"Which is the main reason a drought can become a wildfire problem: dry plants or heavy clouds?",["dry plants","dry vegetation","dry fuel","dry"],["Dry vegetation burns easily.","A spark can start a fire that spreads quickly."])
    SA(t,'B',"Overnight temperatures stay high during a heat wave. Why is this dangerous?",["the body cannot cool down","no relief","body can't recover","people can't cool off","no cooling","body cannot recover"],["The body needs a cool period to recover.","Warm nights add stress, especially for older adults."],adj=0.2)
    # ---------- precip ----------
    t='precip'
    SA(t,'B',"Rain falls at 5 mm per hour. Using light < 2.5, moderate 2.5 to 7.6, heavy > 7.6 mm/hr, how would you describe it?",["moderate","moderate rain"],["5 is between 2.5 and 7.6.","That is moderate rain."])
    NM(t,'B',"A snowfall has a 10:1 snow-to-liquid ratio. How many cm of snow fall when the liquid equivalent is 5 cm?",50,["Multiply by 10.","5 × 10 = 50 cm."],u='cm',free=True)
    SA(t,'F',"Water falling from clouds as rain, snow, sleet or hail is called…",["precipitation"],["Precip for short.","All of these are precipitation."])
    SA(t,'F',"A sudden, quick rise of water in a stream or on land after heavy rain is a…",["flash flood","flood"],["It can happen within minutes to hours.","This is a flash flood."])
    SA(t,'F',"If you see water covering a road, what should you do?",["turn around","turn around don't drown","go another way","turn around, don't drown","do not drive through","don't drive through"],["Just 15 to 30 cm of moving water can carry a car away.","Turn around, don't drown."])
    SA(t,'F',"Which freezes into balls of ice during strong thunderstorms: rain or hail?",["hail"],["Hail grows in strong updrafts.","Raindrops are lifted high and freeze in layers."])
    NM(t,'B',"A storm drops 12 mm of rain per hour for 4 hours. How many millimeters of rain is that in total?",48,["Rate × time = 12 × 4.","48 mm."],u='mm',free=True)
    NM(t,'B',"Convert 2.54 cm of rain to inches. (1 in = 2.54 cm)",1,["Divide by 2.54.","2.54 ÷ 2.54 = 1 inch."],u='in',free=True)
    NM(t,'B',"A rain gauge records 3 inches of rain in 6 hours. What is the average rate in inches per hour?",0.5,["Divide total by time: 3 ÷ 6.","0.5 in/hr."],u='in/hr',free=True)
    SA(t,'B',"A watch vs. a warning: which one means flooding is already happening or imminent?",["warning","flash flood warning","a warning"],["A watch means conditions are favorable.","A warning means it is happening or about to happen."])
    SA(t,'B',"Why do flash floods happen faster in cities?",["pavement does not absorb water","pavement doesn't absorb water","runoff","water runs off pavement","impervious surfaces","concrete doesn't absorb"],["Pavement and roofs do not let water soak in.","Water runs off quickly into streets and streams."],adj=0.2)
    # ---------- light: lightning ----------
    t='light'
    SA(t,'F',"The sound you hear after a lightning flash is called…",["thunder"],["Lightning heats the air very fast.","The air expands, making thunder."])
    SA(t,'F',"Which travels faster, light or sound?",["light"],["Light is almost instant for our purposes.","So you see lightning before you hear thunder."])
    SA(t,'F',"If you can hear thunder, are you close enough to be struck by lightning?",["yes"],["Thunder can be heard about 10 miles away.","Lightning can strike that far from the storm: when thunder roars, go indoors."])
    SA(t,'F',"Where is the safest place during a lightning storm?",["inside a building","indoors","inside","a building","inside a hard-topped vehicle","in a building"],["Fully enclosed buildings are safest.","A hard-topped car is the next best."])
    SA(t,'F',"Should you stand under a lone tree during a thunderstorm?",["no","never"],["Tall isolated objects attract lightning.","Never shelter under a tree."])
    NM(t,'B',"Sound travels about 340 m/s. You hear thunder 6 seconds after a flash. About how far away is the lightning in meters?",2040,["Distance = speed × time.","340 × 6 = 2040 m."],u='m',free=True,tol=0.05)
    NM(t,'B',"A rough rule: divide the seconds between flash and thunder by 3 to get kilometers. The delay is 12 seconds. How many kilometers away?",4,["12 ÷ 3 = 4.","The strike is about 4 km away."],u='km',free=True)
    NM(t,'B',"Divide seconds by 5 to get miles. The delay is 15 seconds. How many miles away?",3,["15 ÷ 5 = 3.","The strike is about 3 miles away."],u='mi',free=True)
    SA(t,'B',"The 30-30 rule says go indoors if flash-to-bang is 30 seconds or less. How long should you wait after the last thunder before going back out?",["30 minutes","30 min","half an hour","30"],["Storms can still strike after they seem to pass.","Wait 30 minutes after the last thunder."])
    SA(t,'B',"Heat lightning is just lightning from a storm that is too what?",["far away","distant","far"],["The storm is too far to hear thunder.","You see the flashes but thunder does not reach you."])
    SA(t,'B',"Cloud-to-ground lightning that starts at the top of the storm and travels down starts as a stepped…",["leader","stepped leader"],["A faint channel of charge moves down in steps.","When it meets an upward streamer, the return stroke flashes."],adj=0.2)
    # ---------- tstorm ----------
    t='tstorm'
    NM(t,'F',"A thunderstorm is severe if it makes hail at least how many inches across?",1,["Severe hail starts at 1 inch, about the size of a quarter.","1 inch."],u='in',free=True)
    SA(t,'F',"What three ingredients make a thunderstorm: moisture, lift and what else?",["instability","unstable air"],["Moisture gives fuel, lift gets air started, instability keeps it rising.","The three are moisture, lift and instability."])
    SA(t,'F',"Which thunderstorm stage has both updrafts and downdrafts: developing, mature or dissipating?",["mature"],["The storm is strongest in the mature stage.","Rain falls and drags air down while updrafts continue."])
    SA(t,'F',"A thunderstorm that makes strong rotating updrafts and lasts for hours is called a…",["supercell"],["Rotation helps the storm survive.","Supercells make most big tornadoes and large hail."])
    NM(t,'B',"A thunderstorm is classified severe if wind gusts reach at least 58 mph. A gust of 50 mph is how many mph below that threshold?",8,["Subtract: 58 − 50.","8 mph below."],u='mph',free=True)
    SA(t,'B',"The rotating updraft in a supercell is called a…",["mesocyclone"],["Meso means middle scale.","A mesocyclone is the rotating updraft."],adj=0.2)
    SA(t,'B',"A strong storm outflow of sinking air that spreads at the ground is called a…",["downburst","outflow","gust front"],["Rain-cooled air sinks fast and fans out.","This sudden wind is a downburst."],adj=0.2)
    SA(t,'B',"Thunderstorms that form in a line are called a…",["squall line"],["Lines of storms move together.","A squall line often has damaging winds."])
    SA(t,'B',"A multicell storm keeps renewing itself by forming new cells where?",["along the gust front","at the gust front","on the gust front","near the gust front","along the outflow","outflow boundary"],["The cool outflow lifts warm air at its edge.","New updrafts form along the gust front."],adj=0.2)
    SA(t,'B',"To grow large hail you need a strong…",["updraft"],["Hail stones keep rising and freezing.","Stronger updrafts hold bigger stones aloft."])
    # ---------- winds ----------
    t='winds'
    NM(t,'B',"A derecho is a long-lived windstorm. Its damage swath must stretch at least how many miles?",240,["A derecho has a swath at least about 240 miles (400 km) long with gusts of at least 58 mph.","240 miles."],u='mi',free=True)
    SA(t,'F',"Wind is air moving from high pressure toward what?",["low pressure","lower pressure","low"],["Air flows from high to low pressure.","It tries to even out pressure."])
    SA(t,'F',"A wind from the north blows toward which direction?",["south","toward the south"],["Wind is named for where it comes from.","North wind moves toward the south."])
    SA(t,'F',"A strong, straight-line wind from a thunderstorm can knock down trees. Is it a tornado?",["no"],["Tornadoes rotate.","Straight-line wind blows in one direction, not rotating."])
    NM(t,'B',"A wind gust measured at 40 knots. Convert to mph. (1 kt ≈ 1.15 mph)",46,["Multiply: 40 × 1.15.","46 mph."],u='mph',free=True)
    SA(t,'B',"What word describes sudden, brief increases in wind speed?",["gusts","gust"],["Winds are never steady.","Short bursts are gusts."])
    CP(t,'B',"A wind is reported as blowing FROM the northeast. Drag the pointer to that direction.",45,["Northeast lies halfway between north (0°) and east (90°).","That is 45°."])
    # ---------- torn ----------
    t='torn'
    SA(t,'F',"What is a rotating column of air touching the ground called?",["tornado"],["It hangs from a thunderstorm.","This is a tornado."])
    SA(t,'F',"Where should you go in a house during a tornado warning?",["basement","lowest floor","interior room","lowest floor interior room","a basement","a small interior room"],["Get as low as you can and away from windows.","A basement or small interior room on the lowest floor."])
    SA(t,'F',"A tornado watch means tornadoes are possible. A tornado warning means a tornado is…",["happening or imminent","occurring","happening","spotted","indicated by radar","imminent"],["Warning means take action now.","It has been seen or radar shows rotation."],adj=0.1)
    SA(t,'F',"The scale used to rate tornadoes by damage is called the…",["enhanced fujita scale","ef scale","fujita scale","ef"],["It runs from EF0 to EF5.","Damage determines the rating."])
    NM(t,'B',"A tornado is rated EF2 with winds up to 135 mph. The EF1 maximum is 110 mph. How many mph higher is the EF2 maximum?",25,["Subtract: 135 − 110.","25 mph."],u='mph',free=True)
    SA(t,'B',"A radar image with a hook shape on the south side of a supercell is called a…",["hook echo"],["The precipitation wraps around the rotation.","This is a hook echo."])
    SA(t,'B',"On Doppler velocity radar, a tight pair of inbound and outbound winds next to each other shows…",["rotation","a couplet","velocity couplet","a velocity couplet"],["Green is toward the radar, red is away.","Side by side, they mean rotation."],adj=0.2)
    SA(t,'B',"On radar, what is a debris ball (tornado debris signature) made of?",["debris","debris lofted by tornado","lofted debris","objects","tornado debris"],["Dust and objects lofted into the air.","Radar sees them as a signature."],adj=0.3)
    NM(t,'B',"EF3 begins at 136 mph. A tornado has winds 12 mph below that. What is its wind speed?",124,["Subtract: 136 − 12.","124 mph, which is in the EF2 range (111–135)."],u='mph',free=True)
    # ---------- hurr ----------
    t='hurr'
    SA(t,'F',"What do we call a huge spinning storm over warm ocean water with winds of 74 mph or more?",["hurricane"],["Called typhoon or cyclone elsewhere.","74 mph is the threshold."])
    SA(t,'F',"What is the calm center of a hurricane called?",["eye"],["The eye has light winds and often clear skies.","But the strongest winds are right around it, in the eyewall."])
    SA(t,'F',"In what season are most Atlantic hurricanes formed: summer-fall or winter?",["summer-fall","summer and fall","summer","fall","late summer"],["Ocean water is warmest then.","The Atlantic season is June 1 to November 30."])
    SA(t,'F',"A hurricane needs warm ocean water. About what temperature, in °C, is the minimum?",["26.5","26.5 °c","27","26.5c"],["Warm water supplies heat and moisture.","About 26.5 °C (80 °F)."],adj=0.2)
    SA(t,'F',"The rising mound of ocean water pushed onto shore by a hurricane is the storm…",["surge","storm surge"],["It is the deadliest hurricane hazard.","Surge floods coastal areas."])
    NM(t,'B',"A tropical storm has winds of 65 mph. How many mph more are needed to be a hurricane (74 mph)?",9,["Subtract: 74 − 65.","9 mph."],u='mph',free=True)
    SA(t,'B',"Which Saffir-Simpson category begins at 111 mph and is called a major hurricane?",["category 3","cat 3","3","cat. 3"],["Majors are category 3 and higher.","Cat 3 is 111–129 mph."])
    SA(t,'B',"What category is a hurricane with winds of 100 mph? (Cat 1: 74–95, Cat 2: 96–110, Cat 3: 111–129)",["category 2","cat 2","2"],["100 is between 96 and 110.","That is category 2."])
    SA(t,'B',"Which side of a Northern Hemisphere hurricane moving north has the strongest winds: right or left?",["right","right side","the right side"],["Storm motion adds to the wind speed on one side.","The right-front quadrant is strongest."],adj=0.2)
    SA(t,'B',"How does a hurricane weaken when it moves over land: it loses its supply of…?",["warm water","heat","moisture","warm ocean water","warm water and moisture"],["Warm ocean water is the fuel.","Over land, friction also slows the wind."])
    SA(t,'B',"Is the eyewall or the outer rain band where the strongest winds usually are?",["eyewall","the eyewall"],["The eyewall surrounds the eye.","It holds the strongest winds and heaviest rain."])
    # ---------- winter ----------
    t='winter'
    SA(t,'B',"Which wintry precipitation builds up the heaviest ice on power lines: sleet or freezing rain?",["freezing rain"],["Freezing rain freezes on contact and coats lines.","Sleet bounces and does not coat them."])
    SA(t,'F',"Frozen raindrops that bounce off the ground as small ice pellets are…",["sleet"],["Rain freezes as it falls through a cold layer.","Sleet is ice pellets."])
    SA(t,'F',"Rain that freezes when it touches the ground and coats everything with ice is…",["freezing rain"],["Drops are liquid until they touch cold surfaces.","Freezing rain makes roads very slippery."])
    SA(t,'F',"A winter storm with strong winds and lots of blowing snow, with low visibility, is a…",["blizzard"],["It needs winds of at least 35 mph for 3 hours.","Visibility is under 1/4 mile."])
    SA(t,'F',"What can make cold air feel even colder when the wind blows?",["wind chill"],["Wind carries heat away from skin.","This is wind chill."])
    SA(t,'F',"Should you travel during a blizzard warning?",["no","avoid","no avoid travel","avoid travel"],["Visibility can drop to near zero.","Stay home or off the road."])
    NM(t,'B',"A blizzard requires sustained winds of at least 35 mph. A storm has 28 mph. How many mph short is it?",7,["Subtract: 35 − 28.","7 mph short."],u='mph',free=True)
    NM(t,'B',"A snowfall is 24 cm. Assuming a 10:1 ratio, how many cm of liquid water does it contain?",2.4,["Divide by 10.","24 ÷ 10 = 2.4 cm."],u='cm',free=True,tol=0.02)
    SA(t,'B',"For freezing rain, the temperature aloft is above 0 °C and at the ground is…",["below 0 °c","below freezing","below 0","below zero","at or below freezing"],["A warm layer melts snow into rain.","Near the ground a thin cold layer refreezes the water on contact."],adj=0.2)
    SA(t,'B',"A lake-effect snow forms when cold air moves across what?",["warm lake water","a warm lake","the great lakes","warmer lakes","lake water"],["Warm water adds heat and moisture.","Snow bands fall on the downwind shores."],adj=0.1)
    # ---------- safety ----------
    t='safety'
    SA(t,'B',"A watch means be prepared. A warning means to…",["take action now","take action","act now","take shelter"],["A warning means the hazard is happening or imminent.","Take action now."],adj=0.1)
    SA(t,'F',"When the weather service says warning, should you act right away?",["yes"],["Warning means danger is happening or imminent.","Take shelter now."])
    SA(t,'F',"What weather radio sounds a loud alarm to alert you of danger?",["noaa weather radio","weather radio","noaa"],["It broadcasts alerts 24 hours a day.","A tone alert can wake you at night."])
    SA(t,'F',"A kit with water, food, flashlight and batteries for emergencies is an emergency…",["kit","supply kit","preparedness kit"],["Keep it ready before a storm.","Enough for a few days."])
    SA(t,'F',"Should you stay away from downed power lines?",["yes"],["Lines can be live.","Stay at least 10 meters away."])
    SA(t,'B',"In a hurricane evacuation, you should follow orders from…",["local officials","emergency officials","local emergency officials","officials"],["They know the surge zones.","Follow their evacuation zones and routes."])
    SA(t,'B',"A mobile home is safe in a tornado: true or false?",["false"],["Mobile homes are easily destroyed.","Go to a sturdy shelter."])
    NM(t,'B',"A family needs 4 liters of water per person for 3 days. There are 5 people. How many liters total?",60,["Total = 4 × 3 × 5.","12 × 5 = 60 L."],u='L',free=True)
    SA(t,'B',"Why should you never run a generator indoors or in a garage?",["carbon monoxide","co","carbon monoxide poisoning"],["Engines make a deadly gas.","Carbon monoxide is odorless."])
    # ---------- cases ----------
    t='cases'
    SA(t,'F',"In what year did the Tri-State Tornado (the deadliest in U.S. history) occur?",["1925"],["It crossed Missouri, Illinois and Indiana.","March 18, 1925."])
    SA(t,'F',"Hurricane Katrina (2005) caused major flooding in which U.S. city?",["new orleans"],["Levees failed.","New Orleans."])
    SA(t,'F',"The 1900 hurricane that killed thousands hit which Texas island city?",["galveston"],["It remains the deadliest natural disaster in U.S. history.","Galveston."])
    SA(t,'F',"The 'Dust Bowl' of the 1930s was caused by drought and what kind of farming practices?",["plowing","poor farming","over-plowing","overplowing","bad farming","poor farming practices"],["Farmers plowed the prairie grass.","With drought, topsoil blew away."],adj=0.2)
    SA(t,'F',"The 2011 Joplin tornado hit which state?",["missouri"],["It was an EF5.","Missouri."])
    NM(t,'B',"The Tri-State Tornado track was about 219 miles long. At an average speed of 60 mph, how many hours did it take to travel that distance?",3.65,["Time = distance ÷ speed.","219 ÷ 60 ≈ 3.65 hours."],u='h',free=True,tol=0.05)
    NM(t,'B',"Hurricane Katrina made landfall in 2005. How many years before 2026 was that?",21,["Subtract: 2026 − 2005.","21 years."],u='yr',free=True)
    SA(t,'B',"Hurricane Sandy (2012) was unusual because it merged with what kind of system before landfall?",["a frontal system","cold front","a front","front","a nor'easter","winter storm","trough"],["Sandy turned and merged with a cold front.","It became a large post-tropical storm."],adj=0.3)
    SA(t,'B',"The 1993 'Storm of the Century' brought snow to which part of the U.S.?",["east coast","eastern u.s.","eastern united states","eastern","the east coast"],["It affected states from Alabama to Maine.","The East Coast."],adj=0.2)
    SA(t,'B',"After a historic case, weather scientists compile data to improve forecasts. This careful study is a…",["case study"],["Look at what happened and why.","A case study."])
