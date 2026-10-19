// Military Data for all nations with flag codes
const nationsData = {
    "USA": {
        name: "United States",
        flag: "🇺🇸",
        countryCode: "us",
        rank: 1,
        budget: "$886B",
        nuclear: { status: true, warheads: 5500, type: "Confirmed" },
        personnel: { active: 1388100, reserve: 799500 },
        description: "The United States Armed Forces are the military forces of the United States. They consist of the Army, Marine Corps, Navy, Air Force, Space Force, and Coast Guard. The President is the Commander-in-Chief. With the world's largest defense budget and most advanced military technology, the U.S. maintains global power projection capabilities.",
        image: "US_details/US_flag.png",
        army: {
            tanks: 5500, apc: 45000, artillery: 3000, mlrs: 1366,
            name: "United States Army",
            founded: "June 14, 1775",
            motto: "This We'll Defend",
            description: "The United States Army is the land warfare service branch of the U.S. Armed Forces. It is the largest and oldest established branch, responsible for land-based military operations. The Army is organized into active duty, Army Reserve, and Army National Guard components, providing a rapid response capability to defend the nation and its interests worldwide.",
            image: "US_details/Usa_army_flag.png",
            equipment: [
                { name: "M1A2 Abrams", count: 2509, type: "Main Battle Tank", description: "Third-generation main battle tank with advanced armor and 120mm smoothbore cannon", image: "US_details/US_army_details/m1a2_abrams.png" },
                { name: "M2 Bradley", count: 4641, type: "Infantry Fighting Vehicle", description: "Armored fighting vehicle providing both transport and fire support", image: "US_details/US_army_details/m2_bradley.png" },
                { name: "Stryker", count: 4900, type: "Armored Fighting Vehicle", description: "Eight-wheeled armored combat vehicle for rapid deployment", image: "US_details/US_army_details/stryker.png" },
                { name: "M109 Paladin", count: 950, type: "Self-Propelled Howitzer", description: "155mm self-propelled artillery piece with automated fire control", image: "US_details/US_army_details/m109_paladin.png" }
            ]
        },
        navy: {
            carriers: 11, submarines: 68, destroyers: 92, frigates: 0,
            name: "United States Navy",
            founded: "October 13, 1775",
            motto: "Semper Fortis (Always Courageous)",
            description: "The United States Navy is the maritime service branch of the U.S. Armed Forces. It is the world's most capable navy, operating globally with 11 nuclear-powered aircraft carriers, nuclear submarine fleet, and over 290 deployable combat vessels. The Navy maintains forward presence, deterrence, sea control, and power projection capabilities across all oceans.",
            image: "US_details/US_navy_flag.jpg"
            ,
            equipment: [
                { name: "Nimitz-class Carrier", count: 10, type: "Aircraft Carrier", description: "Nuclear-powered supercarrier carrying 90+ aircraft", image: "US_details/US_navy_details/nimitz_class_carrier.png" },
                { name: "Gerald R. Ford Carrier", count: 1, type: "Aircraft Carrier", description: "Most advanced carrier with electromagnetic launch system", image: "US_details/US_navy_details/gerald_r_ford_carrier.png" },
                { name: "Ohio-class SSBN", count: 14, type: "Ballistic Missile Submarine", description: "Nuclear submarine carrying Trident II ballistic missiles", image: "US_details/US_navy_details/ohio_class_ssbn.png" },
                { name: "Virginia-class SSN", count: 23, type: "Attack Submarine", description: "Fast attack submarine for anti-submarine and strike missions", image: "US_details/US_navy_details/virginia_class_ssn.png" }
            ]
        },
        airforce: {
            fighters: 1957, bombers: 140, transport: 945, helicopters: 5463,
            name: "United States Air Force",
            founded: "September 18, 1947",
            motto: "Aim High...Fly-Fight-Win",
            description: "The United States Air Force is the aerial and space warfare service branch of the U.S. Armed Forces. It is the world's largest and most technologically advanced air force, operating over 5,000 aircraft. The USAF provides air superiority, global strike, rapid global mobility, and intelligence, surveillance, and reconnaissance capabilities.",
            image: "US_details/US_airforce_flag.jpg",
            equipment: [
                { name: "F-35 Lightning II", count: 450, type: "5th Gen Stealth Fighter", description: "Multi-role stealth fighter with advanced sensors and networking", image: "US_details/US_airforce_details/f35_lightning_ii.png" },
                { name: "F-22 Raptor", count: 187, type: "Air Superiority Fighter", description: "5th generation stealth air dominance fighter", image: "US_details/US_airforce_details/f22_raptor.png" },
                { name: "F-16 Fighting Falcon", count: 936, type: "Multirole Fighter", description: "Highly maneuverable 4th generation fighter aircraft", image: "US_details/US_airforce_details/f16_fighting_falcon.png" },
                { name: "B-2 Spirit", count: 20, type: "Stealth Bomber", description: "Flying-wing strategic stealth bomber for nuclear/conventional strikes", image: "US_details/US_airforce_details/b2_spirit.png" }
            ]
        }
    },
    "Russia": {
        name: "Russia",
        flag: "🇷🇺",
        countryCode: "ru",
        rank: 2,
        budget: "$109B",
        nuclear: { status: true, warheads: 6257, type: "Confirmed" },
        personnel: { active: 1150000, reserve: 2000000 },
        description: "The Russian Armed Forces are the military of the Russian Federation. They comprise the Ground Forces, Aerospace Forces, Navy, Strategic Missile Troops, and Airborne Troops. Russia possesses the world's largest nuclear arsenal and maintains significant conventional forces designed for territorial defense and regional power projection.",
        image: "Russia_details/Russia_flag.jpg",
        army: {
            tanks: 12420, apc: 34000, artillery: 14564, mlrs: 3065,
            name: "Russian Ground Forces",
            founded: "May 7, 1992",
            motto: "Honor and Courage",
            description: "The Russian Ground Forces are the land forces of the Russian Federation. They possess one of the largest tank fleets in the world, with significant artillery and armored capabilities. The force emphasizes combined arms operations with mass artillery support and maintains a large reserve of armored vehicles.",
            image: "Russia_details/Russia_army_flag.jpg",
            equipment: [
                { name: "T-90M", count: 550, type: "Main Battle Tank", description: "Advanced main battle tank with Relikt ERA and improved fire control", image: "Russia_details/Russia_army_details/t90_m.png" },
                { name: "T-72B3", count: 2000, type: "Main Battle Tank", description: "Modernized T-72 with improved armor and thermal sights", image: "Russia_details/Russia_army_details/t72_b3.png" },
                { name: "T-80BVM", count: 450, type: "Main Battle Tank", description: "Gas turbine-powered tank with modern electronics", image: "Russia_details/Russia_army_details/t80_bvm.png" },
                { name: "BMP-3", count: 700, type: "Infantry Fighting Vehicle", description: "Amphibious IFV with 100mm gun and ATGM capability", image: "Russia_details/Russia_army_details/bmp_3.png" } // src: https://en.wikipedia.org/wiki/BMP-3#/media/File:Army2016demo-011.jpg
            ]
        },
        navy: {
            carriers: 1, submarines: 58, destroyers: 15, frigates: 11,
            name: "Russian Navy",
            founded: "October 30, 1696",
            motto: "Glory and Power on the Seas",
            description: "The Russian Navy is the naval warfare service branch of Russian Armed Forces. It operates four major fleets: Northern, Pacific, Black Sea, and Baltic. The Navy maintains Russia's nuclear triad through ballistic missile submarines and projecting power through surface combatants equipped with advanced cruise missiles.",
            image: "Russia_details/Russia_navy_flag.jpg",
            equipment: [
                { name: "Admiral Kuznetsov", count: 1, type: "Aircraft Carrier", description: "Heavy aircraft-carrying cruiser with Su-33 fighters", image: "Russia_details/Russia_navy_details/admiral_kuznetsov.png" }, // src: https://en.wikipedia.org/wiki/Russian_aircraft_carrier_Admiral_Kuznetsov#/media/File:MilitarySportsHoliday2017-03.jpg
                { name: "Borei-class SSBN", count: 5, type: "Ballistic Missile Submarine", description: "Nuclear submarine carrying Bulava SLBMs", image: "Russia_details/Russia_navy_details/borei_class_ssbn.png" }, // src: https://en.wikipedia.org/wiki/Russian_submarine_Yury_Dolgorukiy#/media/File:%C2%AB%D0%AE%D1%80%D0%B8%D0%B9_%D0%94%D0%BE%D0%BB%D0%B3%D0%BE%D1%80%D1%83%D0%BA%D0%B8%D0%B9%C2%BB.jpg
                { name: "Yasen-class SSN", count: 4, type: "Attack Submarine", description: "Advanced nuclear attack submarine with Kalibr missiles", image: "Russia_details/Russia_navy_details/yasen_class_ssn.png" }, // src: https://en.wikipedia.org/wiki/Yasen-class_submarine#/media/File:%D0%9A-560_%C2%AB%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%D0%BE%D0%B4%D0%B2%D0%B8%D0%BD%D1%81%D0%BA%C2%BB.jpg
                { name: "Admiral Gorshkov Frigate", count: 4, type: "Guided Missile Frigate", description: "Modern frigate with Zircon hypersonic missiles", image: "Russia_details/Russia_navy_details/admiral_gorshkov_frigate.png" } // src: https://en.wikipedia.org/wiki/Admiral_Gorshkov-class_frigate#/media/File:Admiral_Gorshkov_frigate_03.jpg
            ]
        },
        airforce: {
            fighters: 1391, bombers: 181, transport: 445, helicopters: 1543,
            name: "Russian Aerospace Forces",
            founded: "August 1, 2015",
            motto: "To Defend and Protect the Skies",
            description: "The Russian Aerospace Forces are a branch of the Russian Armed Forces responsible for all aerial and space operations. They combine the former Air Force and Aerospace Defense Forces, operating advanced fighters, strategic bombers, and extensive air defense systems including the S-400 and S-500.",
            image: "Russia_details/Russia_airforce_flag.jpg",
            equipment: [
                { name: "Su-57", count: 22, type: "5th Gen Stealth Fighter", description: "Russia's first stealth multirole fighter aircraft", image: "Russia_details/Russia_airforce_details/su_57.png" }, // src: https://en.wikipedia.org/wiki/Sukhoi_Su-57#/media/File:Sukhoi_Design_Bureau,_054,_Sukhoi_T-50_(Su-57_prototype)_(49581303977).jpg
                { name: "Su-35S", count: 140, type: "Air Superiority Fighter", description: "Highly maneuverable 4++ generation fighter", image: "Russia_details/Russia_airforce_details/su_35s.png" }, // src: https://en.wikipedia.org/wiki/Sukhoi_Su-35#/media/File:Russian_Air_Force,_RF-81719,_Sukhoi_Su-35S_(49581740157).jpg
                { name: "Su-34", count: 146, type: "Fighter-Bomber", description: "Twin-seat strike fighter for ground attack missions", image: "Russia_details/Russia_airforce_details/su_34.png" }, // src: https://en.wikipedia.org/wiki/Sukhoi_Su-34#/media/File:Russian_Air_Force_Sukhoi_Su-34_Beltyukov-1.jpg
                { name: "Tu-160M", count: 17, type: "Strategic Bomber", description: "Upgraded supersonic variable-sweep wing heavy bomber", image: "Russia_details/Russia_airforce_details/tu_160m.png" } // src: https://en.wikipedia.org/wiki/Tupolev_Tu-160#/media/File:2013_Moscow_Victory_Day_Parade_(57).jpg
            ]
        }
    },
    "China": {
        name: "China",
        flag: "🇨🇳",
        countryCode: "cn",
        rank: 3,
        budget: "$292B",
        nuclear: { status: true, warheads: 500, type: "Confirmed" },
        personnel: { active: 2035000, reserve: 510000 },
        description: "The People's Liberation Army (PLA) is the armed wing of the Chinese Communist Party and the world's largest military by active personnel. China has undergone a massive military modernization program, developing advanced weapons systems, expanding its navy, and building artificial islands in the South China Sea.",
        image: "Chinese_details/Chinese_flag.jpg",
        army: {
            tanks: 5800, apc: 35000, artillery: 5200, mlrs: 2990,
            name: "PLA Ground Force",
            founded: "August 1, 1927",
            motto: "Serve the People",
            description: "The PLA Ground Force is the land-based service branch of the People's Liberation Army. It is the largest standing ground force in the world, with approximately 975,000 active personnel organized into 13 group armies across five theater commands.",
            image: "Chinese_details/Pla_army_flag.png",
            equipment: [
                { name: "Type 99A", count: 1200, type: "Main Battle Tank", description: "China's most advanced MBT with composite/ERA armor, 125mm smoothbore gun, and laser warning system", image: "Chinese_details/China_army_details/type_99a.png" },    // src : https://en.wikipedia.org/wiki/Type_99_tank#/media/File:ZTZ-99A_MBT_20170902.jpg
                { name: "Type 96", count: 2500, type: "Main Battle Tank", description: "Cost-effective MBT forming the backbone of PLA armored forces with 125mm gun", image: "Chinese_details/China_army_details/type_96.png" }, // src: https://en.wikipedia.org/wiki/Type_96_tank#/media/File:TankBiathlon2017Individual-02.jpg
                { name: "ZBD-04", count: 1500, type: "Infantry Fighting Vehicle", description: "Tracked amphibious IFV with 30mm autocannon and HJ-73 ATGM capability", image: "Chinese_details/China_army_details/zbd_04.png" }, // src: https://en.wikipedia.org/wiki/ZBD-04#/media/File:ZBD-04_Infantry_fighting_vehicle_during_an_anniversary_parade.jpg
                { name: "PLZ-05", count: 400, type: "Self-Propelled Howitzer", description: "155mm tracked self-propelled gun-howitzer with automated loading and fire control", image: "Chinese_details/China_army_details/plz_05.png" } // src: https://en.wikipedia.org/wiki/PLZ-05#/media/File:PLZ-05_Self-Propelled_Artillery_20170919.jpg
            ]
        },
        navy: {
            carriers: 3, submarines: 78, destroyers: 52, frigates: 49,
            name: "PLA Navy",
            founded: "April 23, 1949",
            motto: "Defend the Seas",
            description: "The PLA Navy is the largest navy in the world by number of vessels. China has rapidly expanded its fleet with three aircraft carriers, advanced destroyers, and nuclear submarines, projecting power across the Western Pacific and into the Indian Ocean.",
            image: "Chinese_details/Pla_navy_flag.png",
            equipment: [
                { name: "Liaoning Carrier", count: 1, type: "Aircraft Carrier", description: "Refurbished Soviet Kuznetsov-class carrier operating J-15 fighters with ski-jump launch", image: "Chinese_details/China_navy_details/liaoning_carrier.png" }, // src: https://commons.wikimedia.org/w/index.php?search=liaoning+&title=Special%3AMediaSearch&type=image
                { name: "Shandong Carrier", count: 1, type: "Aircraft Carrier", description: "First domestically built carrier with improved design and increased aircraft capacity", image: "Chinese_details/China_navy_details/shandong_carrier.png" }, // src: https://en.wikipedia.org/wiki/Chinese_aircraft_carrier_Shandong#/media/File:Type_002_aircraft_carrier_of_People's_Liberation_Army_Navy.jpg
                { name: "Fujian Carrier", count: 1, type: "Aircraft Carrier", description: "China's most advanced carrier featuring electromagnetic catapult launch system (EMALS)", image: "Chinese_details/China_navy_details/fujian_carrier.png" }, // src: https://en.wikipedia.org/wiki/Chinese_aircraft_carrier_Fujian#/media/File:PLAN_CV-18_Fujian_20250911.jpg
                { name: "Type 094 SSBN", count: 6, type: "Ballistic Missile Submarine", description: "Nuclear-powered submarine carrying JL-2 submarine-launched ballistic missiles", image: "Chinese_details/China_navy_details/type_094_ssbn.png" } //src: https://en.wikipedia.org/wiki/Type_094_submarine#/media/File:Jin_(Type_094)_Class_Ballistic_Missile_Submarine.JPG
            ]
        },
        airforce: {
            fighters: 1200, bombers: 231, transport: 286, helicopters: 912,
            name: "PLA Air Force",
            founded: "November 11, 1949",
            motto: "Sky Shield of the Nation",
            description: "The PLA Air Force is the third-largest air force in the world and the largest in Asia. It has rapidly modernized with 5th-generation stealth fighters, advanced early warning aircraft, and long-range strategic bombers capable of striking targets across the Pacific.",
            image: "Chinese_details/Pla_airforce_flag.png",
            equipment: [
                { name: "J-20", count: 200, type: "5th Gen Stealth Fighter", description: "Twin-engine stealth air superiority fighter with advanced sensors and supermaneuverability", image: "Chinese_details/China_airforce_details/j_20.png" }, //src: https://en.wikipedia.org/wiki/Chengdu_J-20#/media/File:J-20s.jpg
                { name: "J-16", count: 300, type: "Multirole Strike Fighter", description: "Twin-seat heavy multirole fighter based on Su-30 with AESA radar and PL-15 missiles", image: "Chinese_details/China_airforce_details/j_16.png" }, //src: https://en.wikipedia.org/wiki/Shenyang_J-16#/media/File:PLAAF_J-16_-_1.jpg
                { name: "J-10C", count: 350, type: "Multirole Fighter", description: "Single-engine 4.5-gen delta-canard fighter with AESA radar for air superiority and ground attack", image: "Chinese_details/China_airforce_details/j_10c.png" }, //src: https://en.wikipedia.org/wiki/Chengdu_J-10#/media/File:PLAAF_J-10A_-_1.jpg
                { name: "H-6K", count: 180, type: "Strategic Bomber", description: "Modernized long-range bomber capable of carrying CJ-20 cruise missiles for stand-off strikes", image: "Chinese_details/China_airforce_details/h_6k.png" } //src: https://en.wikipedia.org/wiki/Xi%27an_H-6#/media/File:%E4%BE%B5%E7%8A%AF%E4%B8%AD%E8%8F%AF%E6%B0%91%E5%9C%8B%E8%88%AA%E7%A9%BA%E8%AD%98%E5%88%A5%E5%8D%80%E7%9A%84%E8%BD%9F-6.jpg
            ]
        }
    },
    "India": {
        name: "Republic of India",
        flag: "🇮🇳",
        countryCode: "in",
        rank: 4,
        budget: "$83.6B",
        nuclear: { status: true, warheads: 172, type: "Confirmed" },
        personnel: { active: 1455550, reserve: 1155000 },
        description: "The Indian Armed Forces are the military forces of the Republic of India. They consist of the Indian Army, the Indian Navy, and the Indian Air Force. India maintains the world's fourth-largest military, with strong capabilities for conventional warfare, nuclear deterrence, and regional power projection across South Asia and the Indian Ocean.",
        image: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&h=400&fit=crop",
        army: {
            tanks: 4614, apc: 8600, artillery: 4200, mlrs: 374,
            name: "Indian Army",
            founded: "April 1, 1895",
            motto: "Service Before Self",
            description: "The Indian Army is the land-based branch and the largest component of the Indian Armed Forces. It is the world's second-largest standing army, with over 1.4 million active troops. The Indian Army is responsible for land-based military operations and maintaining territorial integrity along India's borders with Pakistan and China.",
            image: "India_details/Indian_army_flag.png",
            equipment: [
                { name: "T-90 Bhishma", count: 1200, type: "Main Battle Tank", description: "Russian-origin tank with Indian modifications and ERA armor", image: "India_details/India_army_details/t_90_bhishma.png" }, //src: https://upload.wikimedia.org/wikipedia/commons/1/1d/T-90_Bhisma_cropped.jpg
                { name: "Arjun MBT Mk.1A", count: 124, type: "Main Battle Tank", description: "Indigenous third-generation main battle tank", image: "India_details/India_army_details/arjun_mbt_mk1a.png" }, //src: https://en.wikipedia.org/wiki/Arjun_(tank)#/media/File:Arjun_MK1A_field_trials.jpg
                { name: "BMP-2 Sarath", count: 2500, type: "Infantry Fighting Vehicle", description: "License-built IFV with 30mm cannon", image: "India_details/India_army_details/bmp_2_sarath.png" }, //src: https://upload.wikimedia.org/wikipedia/commons/0/05/ICV_BMP_II_Sarath_passes_through_the_Rajpath_during_the_full_dress_rehearsal_for_the_Republic_Day_Parade-2009.jpg
                { name: "K9 Vajra-T", count: 100, type: "Self-Propelled Howitzer", description: "155mm howitzer built in collaboration with South Korea", image: "India_details/India_army_details/k9_vajra_t.png" } //src: https://upload.wikimedia.org/wikipedia/commons/0/08/K-9_VAJRA-T_passes_through_the_Rajpath%2C_at_the_71st_Republic_Day_Celebrations%2C_at_Rajpath%2C_in_New_Delhi_on_January_26%2C_2020.jpg
            ]
        },
        navy: {
            carriers: 2, submarines: 18, destroyers: 11, frigates: 13,
            name: "Indian Navy",
            founded: "January 26, 1950",
            motto: "Sham No Varunah (May the Lord of Water be auspicious unto us)",
            description: "The Indian Navy is the naval branch of the Indian Armed Forces. It is a blue-water navy with significant capabilities for maritime security in the Indian Ocean region. The Indian Navy operates aircraft carriers, nuclear submarines, and modern destroyers, providing power projection across the Indo-Pacific.",
            image: "India_details/Indian_navy_flag.png",
            equipment: [
                { name: "INS Vikramaditya", count: 1, type: "Aircraft Carrier", description: "Modified Kiev-class carrier operating MiG-29K fighters", image: "India_details/India_navy_details/ins_vikramaditya.png" }, //src: https://en.wikipedia.org/wiki/INS_Vikramaditya#/media/File:INS_Vikramaditya_during_trials.jpg
                { name: "INS Vikrant", count: 1, type: "Aircraft Carrier", description: "Indigenous aircraft carrier, India's first domestically built carrier", image: "India_details/India_navy_details/ins_vikrant.png" }, //src: https://upload.wikimedia.org/wikipedia/commons/9/94/IAC-1_Vikrant_going_for_its_maiden_sea_trials.jpg
                { name: "INS Arihant", count: 2, type: "Ballistic Missile Submarine", description: "Nuclear-powered submarine carrying K-15 SLBMs", image: "India_details/India_navy_details/ins_arihant.png" }, //src: AI-Generated Image
                { name: "Kolkata-class Destroyer", count: 4, type: "Guided Missile Destroyer", description: "Stealth destroyer with BrahMos supersonic missiles", image: "India_details/India_navy_details/kolkata_class_destroyer.png" } //src: https://en.wikipedia.org/wiki/Kolkata-class_destroyer#/media/File:INS_Kolkata_steams_alongside_the_guided-missile_destroyer_USS_Sterett_(DDG_104)_during_Malabar_2020_(cropped).jpg
            ]
        },
        airforce: {
            fighters: 538, bombers: 0, transport: 250, helicopters: 720,
            name: "Indian Air Force",
            founded: "October 8, 1932",
            motto: "Nabha Sprsham Deeptam (Touch the Sky with Glory)",
            description: "The Indian Air Force is the air arm of the Indian Armed Forces. It is the world's fourth-largest air force by fleet strength. The IAF provides air defense, tactical and strategic airlift, and close air support capabilities. Recent modernization includes the acquisition of Rafale fighters and development of indigenous Tejas aircraft.",
            image: "India_details/Indian_airforce_flag.png",
            equipment: [
                { name: "Su-30MKI", count: 260, type: "Air Superiority Fighter", description: "Heavy twin-engine fighter with thrust vectoring", image: "India_details/India_airforce_details/su30_mki.png" }, // src: https://en.wikipedia.org/wiki/Sukhoi_Su-30MKI#/media/File:Su-30_MKI_firing_Brahmos-ER.jpg
                { name: "Dassault Rafale", count: 36, type: "Multirole Fighter", description: "French 4.5 generation omnirole combat aircraft", image: "India_details/India_airforce_details/dassault_rafale.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/6/68/Rafale_aircraft_being_presented_a_water_cannon_salute_to_mark_its_induction_in_Indian_Air_Force.jpg
                { name: "MiG-29UPG", count: 66, type: "Multirole Fighter", description: "Upgraded twin-engine fighter with modern avionics", image: "India_details/India_airforce_details/mig29_upg.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/5/5f/Mikoyan-Gurevich_MiG-29UPG_Fulcrum%2C_India_-_Air_Force_JP7677166.jpg
                { name: "HAL Tejas Mk.1", count: 40, type: "Light Combat Aircraft", description: "Indigenous single-engine multirole light fighter", image: "India_details/India_airforce_details/hal_tejas_mk1.png" } //src: https://upload.wikimedia.org/wikipedia/commons/0/0c/HAL_Tejas1.jpg
            ]
        }
    },
    "UK": {
        name: "United Kingdom",
        flag: "🇬🇧",
        countryCode: "gb",
        rank: 5,
        budget: "$68.4B",
        nuclear: { status: true, warheads: 225, type: "Confirmed" },
        personnel: { active: 148500, reserve: 37000 },
        description: "The British Armed Forces are the military forces of the United Kingdom. The UK maintains a blue-water navy with global reach, nuclear deterrent, and expeditionary capabilities. As a founding member of NATO, the UK plays a central role in European and global security.",
        image: "UK_details/UK_flag.jpg",
        army: {
            tanks: 227, apc: 5015, artillery: 236, mlrs: 44,
            name: "British Army",
            founded: "1660",
            motto: "Be the Best",
            description: "The British Army is the principal land warfare force of the United Kingdom. It has served in conflicts worldwide and specializes in expeditionary operations, armored warfare, and counterinsurgency.",
            image: "UK_details/British_army_flag.webp",
            equipment: [
                { name: "Challenger 2", count: 227, type: "Main Battle Tank", description: "British MBT with Chobham/Dorchester armor and 120mm rifled gun, proven in Iraq", image: "UK_details/UK_army_details/challenger_2.png" }, // src: https://en.wikipedia.org/wiki/Challenger_2#/media/File:Challenger_2_Main_Battle_Tank_patrolling_outside_Basra,_Iraq_MOD_45148325.jpg
                { name: "Warrior IFV", count: 450, type: "Infantry Fighting Vehicle", description: "Tracked armored vehicle carrying infantry with 30mm Rarden cannon", image: "UK_details/UK_army_details/warrior_ifv.png" }, // src: https://en.wikipedia.org/wiki/FV510_Warrior#/media/File:ARMOURED_VEHICLE_FLEET_SUPPORT_CONTRACT_ANNOUNCED_(45149221).jpg
                { name: "Ajax", count: 400, type: "Armored Reconnaissance", description: "Next-gen armored fighting vehicle family for reconnaissance and fire support", image: "UK_details/UK_army_details/ajax.png" }, // src: https://en.wikipedia.org/wiki/General_Dynamics_Ajax#/media/File:AJAX,_the_Future_Armoured_Fighting_Vehicle_for_the_British_Army_MOD_45159441.jpg
                { name: "AS-90", count: 89, type: "Self-Propelled Howitzer", description: "155mm self-propelled artillery with automated loading and burst fire capability", image: "UK_details/UK_army_details/as_90.png" } // src: https://en.wikipedia.org/wiki/AS-90#/media/File:AHS_Krab_SPH_Exercise_Dynamic_Front_22.jpg
            ]
        },
        navy: {
            carriers: 2, submarines: 11, destroyers: 6, frigates: 12,
            name: "Royal Navy",
            founded: "1546",
            motto: "Si vis pacem, para bellum (If you wish peace, prepare for war)",
            description: "The Royal Navy is the UK's principal naval warfare force. It operates two Queen Elizabeth-class aircraft carriers, nuclear submarines, and maintains the UK's continuous at-sea nuclear deterrent.",
            image: "UK_details/Royal_navy_flag.png",
            equipment: [
                { name: "Queen Elizabeth Carrier", count: 2, type: "Aircraft Carrier", description: "65,000-ton STOVL carriers with twin-island design carrying F-35B fighters", image: "UK_details/UK_navy_details/queen_elizabeth_carrier.png" }, // src: https://en.wikipedia.org/wiki/Queen_Elizabeth-class_aircraft_carrier#/media/File:HMS_Queen_Elizabeth_and_HMS_Prince_of_Wales_meet_at_sea_for_the_first_time.jpg
                { name: "Vanguard-class SSBN", count: 4, type: "Ballistic Missile Submarine", description: "Nuclear deterrent submarine carrying Trident II D5 missiles", image: "UK_details/UK_navy_details/vanguard_class_ssbn.png" }, // src: https://en.wikipedia.org/wiki/Vanguard-class_submarine#/media/File:HMS_Victorious._08-12-2003_MOD_45143491.jpg
                { name: "Astute-class SSN", count: 6, type: "Attack Submarine", description: "Nuclear-powered hunter-killer submarine with Tomahawk cruise missiles", image: "UK_details/UK_navy_details/astute_class_ssn.png" }, // src: https://en.wikipedia.org/wiki/Astute-class_submarine#/media/File:HMS_Ambush_long.jpg
                { name: "Type 45 Destroyer", count: 6, type: "Air Defence Destroyer", description: "Daring-class destroyer with Sea Viper air defense system", image: "UK_details/UK_navy_details/type_45_destroyer.png" } // src: https://en.wikipedia.org/wiki/Type_45_destroyer#/media/File:HMS_Defender_(8614177368).jpg
            ]
        },
        airforce: {
            fighters: 137, bombers: 0, transport: 78, helicopters: 272,
            name: "Royal Air Force",
            founded: "April 1, 1918",
            motto: "Per Ardua Ad Astra (Through Adversity to the Stars)",
            description: "The Royal Air Force is the UK's aerial warfare force and the world's oldest independent air force. It operates Typhoon and F-35B fighters, strategic transport, and supports nuclear deterrence.",
            image: "UK_details/Royal_airforce_flag.png",
            equipment: [
                { name: "F-35B Lightning II", count: 33, type: "5th Gen STOVL Fighter", description: "Stealth multirole fighter with short take-off and vertical landing for carrier operations", image: "UK_details/UK_airforce_details/f35b_lightning_ii.png" }, // src: https://en.wikipedia.org/wiki/Lockheed_Martin_F-35_Lightning_II#/media/File:X-35B_Edwards.jpg
                { name: "Typhoon FGR4", count: 137, type: "Multirole Fighter", description: "Twin-engine 4.5-gen fighter for air superiority, ground attack, and QRA duties", image: "UK_details/UK_airforce_details/typhoon_fgr4.png" }, // src: https://en.wikipedia.org/wiki/Eurofighter_Typhoon#/media/File:RAF_Eurofighter_EF-2000_Typhoon_F2_Lofting-1.jpg
                { name: "A400M Atlas", count: 22, type: "Strategic Transport", description: "Four-engine turboprop military transport aircraft for heavy airlift", image: "UK_details/UK_airforce_details/a400m_atlas.png" }, // src: https://en.wikipedia.org/wiki/Airbus_A400M_Atlas#/media/File:A400M_-_RIAT_2013_(9360601998).jpg
                { name: "AH-64E Apache", count: 50, type: "Attack Helicopter", description: "Twin-engine attack helicopter with Hellfire missiles and 30mm chain gun", image: "UK_details/UK_airforce_details/ah_64e_apache.png" } // src: https://en.wikipedia.org/wiki/Boeing_AH-64_Apache#/media/File:RNLAF_AH-64_Apache_at_the_Oirschotse_Heide_Low_Flying_Area_(36570605232).jpg
            ]
        }
    },
    "France": {
        name: "France",
        flag: "🇫🇷",
        countryCode: "fr",
        rank: 7,
        budget: "$53.6B",
        nuclear: { status: true, warheads: 290, type: "Confirmed" },
        personnel: { active: 203250, reserve: 35000 },
        description: "The French Armed Forces maintain full-spectrum military capabilities including nuclear deterrence, a nuclear-powered aircraft carrier, and expeditionary forces deployed across Africa and the Middle East. France has the strongest military in the European Union.",
        image: "France_details/France_flag.png",
        army: {
            tanks: 222, apc: 6000, artillery: 301, mlrs: 13,
            name: "French Army (Armée de Terre)",
            founded: "1445",
            motto: "Honneur et Patrie (Honor and Fatherland)",
            description: "The French Army is one of NATO's most experienced land forces, regularly deployed in overseas operations across Africa and the Middle East. It is currently undergoing the Scorpion modernization program.",
            image: "France_details/French_army_flag.png",
            equipment: [
                { name: "Leclerc MBT", count: 222, type: "Main Battle Tank", description: "French 3rd-gen MBT with modular composite armor, 120mm smoothbore gun, and autoloader", image: "France_details/France_army_details/leclerc_mbt.png" }, // src: https://en.wikipedia.org/wiki/Leclerc_(tank)#/media/File:Leclerc-openphotonet_PICT6015.JPG
                { name: "VBCI", count: 630, type: "Infantry Fighting Vehicle", description: "8x8 wheeled armored IFV with 25mm cannon for mechanized infantry", image: "France_details/France_army_details/vbci.png" }, // src: https://en.wikipedia.org/wiki/VBCI#/media/File:VBCI_(V%C3%A9hicule_blind%C3%A9_de_combat_d'infanterie)_(1).JPG
                { name: "VAB", count: 2700, type: "Armored Personnel Carrier", description: "4x4/6x6 amphibious APC widely used in French overseas deployments", image: "France_details/France_army_details/vab.png" }, // src: https://en.wikipedia.org/wiki/V%C3%A9hicule_de_l%27Avant_Blind%C3%A9#/media/File:Fin_de_d%C3%A9fil%C3%A9_14_juillet_2022,_Paris_Porte_d'Orl%C3%A9ans_(1)_04.jpg
                { name: "CAESAR", count: 77, type: "Self-Propelled Howitzer", description: "155mm wheeled self-propelled gun-howitzer with rapid deployment capability, combat-proven in Ukraine", image: "France_details/France_army_details/caesar.png" } // src: https://en.wikipedia.org/wiki/CAESAR_self-propelled_howitzer#/media/File:9th_Light_Armoured_Marine_Brigade_Bastille_Day_2013_Paris_t114135.jpg
            ]
        },
        navy: {
            carriers: 1, submarines: 10, destroyers: 11, frigates: 11,
            name: "French Navy (Marine Nationale)",
            founded: "1624",
            motto: "Honneur, Patrie, Valeur, Discipline",
            description: "The French Navy operates the only nuclear-powered aircraft carrier outside the US Navy — the Charles de Gaulle. It maintains nuclear submarine deterrence and projects power globally.",
            image: "France_details/French_navy_flag.png",
            equipment: [
                { name: "Charles de Gaulle", count: 1, type: "Nuclear Aircraft Carrier", description: "42,500-ton nuclear-powered carrier with catapult launch system for Rafale-M fighters", image: "France_details/France_navy_details/charles_de_gaulle.png" }, // src: https://en.wikipedia.org/wiki/French_aircraft_carrier_Charles_de_Gaulle#/media/File:French_aircraft_carrier_Charles_de_Gaulle_(R91)_underway_in_the_Ionian_Sea_on_17_March_2022_(220317-N-DH793-1322)cropped.JPG
                { name: "Triomphant-class SSBN", count: 4, type: "Ballistic Missile Submarine", description: "Nuclear deterrent submarine carrying M51 submarine-launched ballistic missiles", image: "France_details/France_navy_details/triomphant_class_ssbn.png" }, // src: https://en.wikipedia.org/wiki/Triomphant-class_submarine#/media/File:SNLE_de_classe_le_Triomphant.jpg
                { name: "Suffren-class SSN", count: 3, type: "Attack Submarine", description: "Barracuda-class nuclear attack submarine with MdCN cruise missiles", image: "France_details/France_navy_details/suffren_class_ssn.png" }, // src: https://en.wikipedia.org/wiki/Suffren-class_submarine#/media/File:Suffren_French_Navy.jpg
                { name: "Horizon-class Destroyer", count: 2, type: "Air Defence Destroyer", description: "Franco-Italian air defense destroyer with Aster missile system", image: "France_details/France_navy_details/horizon_class_destroyer.png" } // src: https://en.wikipedia.org/wiki/Horizon-class_frigate#/media/File:Nave_Caio_Duilio.jpg
            ]
        },
        airforce: {
            fighters: 234, bombers: 0, transport: 139, helicopters: 360,
            name: "French Air and Space Force",
            founded: "1909",
            motto: "Faire face (Face the Challenge)",
            description: "The French Air and Space Force operates the Rafale omnirole fighter and maintains France's airborne nuclear deterrent. It has extensive experience in combat operations across Libya, Mali, and Syria.",
            image: "France_details/French_airforce_flag.png",
            equipment: [
                { name: "Rafale", count: 234, type: "Omnirole Fighter", description: "Twin-engine 4.5-gen fighter with nuclear strike, air dominance, and reconnaissance capability", image: "France_details/France_airforce_details/rafale.png" }, // src: https://en.wikipedia.org/wiki/Dassault_Rafale#/media/File:Rafale_-_RIAT_2009_(3751416421).jpg
                { name: "A400M Atlas", count: 18, type: "Strategic Transport", description: "Four-engine turboprop transport for tactical and strategic airlift operations", image: "France_details/France_airforce_details/a400m_atlas.png" }, // src: https://en.wikipedia.org/wiki/Airbus_A400M_Atlas#/media/File:A400M_-_RIAT_2013_(9360601998).jpg
                { name: "Tiger HAD", count: 67, type: "Attack Helicopter", description: "Eurocopter twin-engine attack helicopter with Hellfire/Mistral missiles", image: "France_details/France_airforce_details/tiger_had.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/3/38/French_Army%2C_6010%2C_Eurocopter_EC_665_Tiger_HAD_%2849580123847%29.jpg
                { name: "NH90", count: 100, type: "Medium Transport Helicopter", description: "NATO multi-role military helicopter for tactical transport and naval operations", image: "France_details/France_airforce_details/nh90.png" } // src: https://en.wikipedia.org/wiki/NHIndustries_NH90#/media/File:NH90_TCG_Kuzey_Ege.jpg
            ]
        }
    },
    "Germany": {
        name: "Germany",
        flag: "🇩🇪",
        countryCode: "de",
        rank: 9,
        budget: "$66.8B",
        nuclear: { status: false },
        personnel: { active: 183500, reserve: 30000 },
        description: "The Bundeswehr is undergoing a major rearmament following the 2022 €100 billion special fund. Germany is the backbone of NATO's conventional defense in Central Europe with world-class armored vehicles and the Eurofighter fleet.",
        image: "Germany_details/Germany_flag.jpg",
        army: {
            tanks: 266, apc: 4800, artillery: 121, mlrs: 38,
            name: "German Army (Heer)",
            founded: "November 12, 1955",
            motto: "Schützen, Helfen, Vermitteln, Kämpfen (Protect, Help, Mediate, Fight)",
            description: "The German Army is the land component of the Bundeswehr. It produces some of the world's finest armored vehicles including the Leopard 2 tank and Puma IFV, which are exported to many NATO allies.",
            image: "Germany_details/German_army_flag.png",
            equipment: [
                { name: "Leopard 2A7", count: 266, type: "Main Battle Tank", description: "World-leading MBT with modular armor, 120mm L55A1 gun, and urban warfare package", image: "Germany_details/Germany_army_details/leopard_2a7.png" }, // src: https://en.wikipedia.org/wiki/Leopard_2#/media/File:Leopard_2_A7V_313_Bad_Frankenhausen_2024.JPG
                { name: "Puma IFV", count: 350, type: "Infantry Fighting Vehicle", description: "Heavily armored tracked IFV with 30mm autocannon and Spike ATGM", image: "Germany_details/Germany_army_details/puma_ifv.png" }, // src: https://en.wikipedia.org/wiki/Puma_(German_infantry_fighting_vehicle)#/media/File:Puma,_first_series.jpg
                { name: "Boxer", count: 1000, type: "Armored Personnel Carrier", description: "8x8 modular wheeled APC with interchangeable mission modules", image: "Germany_details/Germany_army_details/boxer.png" }, // src: https://en.wikipedia.org/wiki/Boxer_(armoured_fighting_vehicle)#/media/File:DSCN7330-crop_-_Copy.jpg
                { name: "PzH 2000", count: 108, type: "Self-Propelled Howitzer", description: "155mm tracked SPH with exceptional range and rate of fire, combat-proven in Ukraine", image: "Germany_details/Germany_army_details/pzh_2000.png" } // src: https://en.wikipedia.org/wiki/Panzerhaubitze_2000#/media/File:Lithuanian_PzH_2000_(2).jpg
            ]
        },
        navy: {
            carriers: 0, submarines: 6, destroyers: 0, frigates: 11,
            name: "German Navy (Deutsche Marine)",
            founded: "November 12, 1955",
            motto: "Wir. Dienen. Deutschland. (We. Serve. Germany.)",
            description: "The German Navy focuses on Baltic Sea defense and NATO maritime operations. It operates advanced conventional submarines and frigates specialized in air defense and anti-submarine warfare.",
            image: "Germany_details/German_navy_flag.png",
            equipment: [
                { name: "Type 212A Submarine", count: 6, type: "Attack Submarine", description: "Air-independent propulsion submarine — world's first production fuel cell sub", image: "Germany_details/Germany_navy_details/type_212a_submarine.png" }, // src: https://en.wikipedia.org/wiki/Type_212A_submarine#/media/File:U_34_in_Fahrt.jpg
                { name: "F125 Frigate", count: 4, type: "Stabilization Frigate", description: "Baden-Württemberg-class designed for sustained low-intensity operations", image: "Germany_details/Germany_navy_details/f125_frigate.png" }, // src: https://en.wikipedia.org/wiki/Baden-W%C3%BCrttemberg-class_frigate#/media/File:BADEN-WURTTEMBERG_00257_(cropped).jpg
                { name: "F124 Frigate", count: 3, type: "Air Defence Frigate", description: "Sachsen-class with SMART-L radar and SM-2 missiles for fleet air defense", image: "Germany_details/Germany_navy_details/f124_frigate.png" }, // src: https://en.wikipedia.org/wiki/Sachsen-class_frigate#/media/File:F221_FGS_Hessen_(8640310899).jpg
                { name: "K130 Corvette", count: 5, type: "Corvette", description: "Braunschweig-class multipurpose corvette with RBS-15 anti-ship missiles", image: "Germany_details/Germany_navy_details/k130_corvette.png" } // src: https://en.wikipedia.org/wiki/German_corvette_Magdeburg#/media/File:Stralsund_(2025-06-28),_Tag_der_Bundeswehr_2025_28.jpg
            ]
        },
        airforce: {
            fighters: 229, bombers: 0, transport: 56, helicopters: 266,
            name: "German Air Force (Luftwaffe)",
            founded: "November 12, 1955",
            motto: "Suum Cuique (To Each His Own)",
            description: "The modern Luftwaffe operates Eurofighter Typhoons and Tornado strike aircraft. It is transitioning to the F-35A for nuclear sharing and participating in the Franco-German FCAS program.",
            image: "Germany_details/German_airforce_flag.png",
            equipment: [
                { name: "Eurofighter Typhoon", count: 140, type: "Multirole Fighter", description: "Twin-engine 4.5-gen delta-canard fighter for air superiority and ground attack", image: "Germany_details/Germany_airforce_details/eurofighter_typhoon.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/b/ba/German_Air_Force_Eurofighter_Typhoon_EF2000_31%2B06_Royal_International_Air_Tattoo_2024_01.jpg
                { name: "Tornado", count: 89, type: "Strike Fighter", description: "Variable-geometry strike/reconnaissance aircraft, nuclear strike capable", image: "Germany_details/Germany_airforce_details/tornado.png" }, // src: https://en.wikipedia.org/wiki/Panavia_Tornado#/media/File:Tornado_ECR_JaBoG_32_1997.JPEG
                { name: "A400M Atlas", count: 45, type: "Strategic Transport", description: "Tactical/strategic transport aircraft replacing C-160 Transall", image: "Germany_details/Germany_airforce_details/a400m_atlas.png" }, // src: https://en.wikipedia.org/wiki/Airbus_A400M_Atlas#/media/File:German_Air_Force_Airbus_A400M_(out_cropped).jpg
                { name: "Tiger UHT", count: 51, type: "Attack Helicopter", description: "Fire-support variant of Eurocopter Tiger with PARS 3 anti-tank missiles", image: "Germany_details/Germany_airforce_details/tiger_uht.png" } // src: https://en.wikipedia.org/wiki/Eurocopter_Tiger#/media/File:20170810034242!Eurocopter_EC-665_Tiger_UHT,_Germany_-_Army_AN1547188_(2).jpg
            ]
        }
    },
    "Japan": {
        name: "Japan",
        flag: "🇯🇵",
        countryCode: "jp",
        rank: 8,
        budget: "$54B",
        nuclear: { status: false },
        personnel: { active: 247150, reserve: 56000 },
        description: "The Japan Self-Defense Forces are one of the most technologically advanced militaries in Asia. Japan has recently revised its pacifist defense policies, adopting counterstrike capabilities and doubling its defense budget to counter threats from China and North Korea.",
        image: "Japan_details/Japan_flag.jpg",
        army: {
            tanks: 561, apc: 2000, artillery: 590, mlrs: 99,
            name: "Japanese Ground Self-Defense Force",
            founded: "July 1, 1954",
            motto: "Defend the Nation",
            description: "The JGSDF is Japan's land warfare branch, specializing in island defense and anti-amphibious operations. It maintains advanced indigenous tanks and is developing rapid deployment capabilities for remote island defense.",
            image: "Japan_details/Japanese_army_flag.png",
            equipment: [
                { name: "Type 10 MBT", count: 120, type: "Main Battle Tank", description: "Indigenous 4th-gen MBT with modular composite armor and C4I network integration", image: "Japan_details/Japan_army_details/type_10_mbt.png" }, // src: https://en.wikipedia.org/wiki/Type_10#/media/File:Type10MBT.jpg
                { name: "Type 90 MBT", count: 340, type: "Main Battle Tank", description: "Japanese MBT with Rheinmetall 120mm gun and automatic loader", image: "Japan_details/Japan_army_details/type_90_mbt.png" }, // src: https://en.wikipedia.org/wiki/Type_90_tank#/media/File:Japanese_Type_90_Tank_-_2.jpg
                { name: "Type 16 MCV", count: 200, type: "Mobile Combat Vehicle", description: "8x8 wheeled tank destroyer with 105mm gun for rapid island deployment", image: "Japan_details/Japan_army_details/type_16_mcv.png" }, // src: https://en.wikipedia.org/wiki/Type_16_MCV#/media/File:JGSDF_Type_16_Maneuver_Combat_Vehicle_(26-7978)_left_front_view_at_JASDF_Hamamatsu_Air_Base_October_23,_2022_01.jpg
                { name: "Type 99 SPH", count: 140, type: "Self-Propelled Howitzer", description: "155mm tracked self-propelled howitzer with automated fire control system", image: "Japan_details/Japan_army_details/type_99_sph.png" } // src: https://en.wikipedia.org/wiki/Type_99_155_mm_self-propelled_howitzer#/media/File:JGSDF_type99_SPH_higashi_fuji_Firing_Space.JPG
            ]
        },
        navy: {
            carriers: 0, submarines: 22, destroyers: 36, frigates: 4,
            name: "Japan Maritime Self-Defense Force",
            founded: "July 1, 1954",
            motto: "Guardian of the Sea",
            description: "The JMSDF is one of the most powerful navies in the Pacific. It operates helicopter carriers being converted for F-35B, advanced Aegis destroyers, and the world's most capable conventional submarine fleet.",
            image: "Japan_details/Japanese_navy_flag.jpg",
            equipment: [
                { name: "Izumo-class Carrier", count: 2, type: "Light Aircraft Carrier", description: "27,000-ton helicopter destroyer being converted to carry F-35B fighters", image: "Japan_details/Japan_navy_details/izumo_class_carrier.png" }, // src: https://en.wikipedia.org/wiki/Izumo-class_destroyer#/media/File:JS_Izumo%EF%BC%88DDH-183%EF%BC%89seen_from_the_sky_10-03-2021.jpg
                { name: "Soryu-class Submarine", count: 12, type: "Attack Submarine", description: "Diesel-electric submarine with Stirling AIP and lithium-ion battery variants", image: "Japan_details/Japan_navy_details/soryu_class_submarine.png" }, // src: https://en.wikipedia.org/wiki/S%C5%8Dry%C5%AB-class_submarine#/media/File:Hakuryu-130412-N-LS794-166.jpg
                { name: "Taigei-class Submarine", count: 3, type: "Attack Submarine", description: "Next-gen submarine with lithium-ion batteries for extended underwater endurance", image: "Japan_details/Japan_navy_details/taigei_class_submarine.png" }, // src: https://en.wikipedia.org/wiki/JS_Hakugei#/media/File:JS_Hakugei(SS-514)_launching_ceremony_at_Kawasaki_Heavy_Industries_Kobe_Shipyard_October_14,_2021_12.jpg
                { name: "Maya-class Destroyer", count: 2, type: "Guided Missile Destroyer", description: "Aegis BMD destroyer with cooperative engagement capability and SM-3 missiles", image: "Japan_details/Japan_navy_details/maya_class_destroyer.png" } // src: https://en.wikipedia.org/wiki/Maya-class_destroyer#/media/File:DDG_Maya.jpg
            ]
        },
        airforce: {
            fighters: 289, bombers: 0, transport: 59, helicopters: 456,
            name: "Japan Air Self-Defense Force",
            founded: "July 1, 1954",
            motto: "Defend the Sky",
            description: "The JASDF operates 5th-gen F-35A stealth fighters and F-15J Eagles. Japan is developing the next-gen F-X fighter and investing heavily in stand-off missile capabilities.",
            image: "Japan_details/Japanese_airforce_flag.png",
            equipment: [
                { name: "F-35A Lightning II", count: 42, type: "5th Gen Stealth Fighter", description: "Stealth multirole fighter with integrated sensor suite and data-linking", image: "Japan_details/Japan_airforce_details/f35a_lightning_ii.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/6/6f/F-35A_from_the_Japan_Air_Force.jpg
                { name: "F-15J Eagle", count: 155, type: "Air Superiority Fighter", description: "Twin-engine air superiority fighter with Japanese-upgraded avionics and radar", image: "Japan_details/Japan_airforce_details/f15j_eagle.png" }, // src: https://en.wikipedia.org/wiki/Mitsubishi_F-15J#/media/File:Two_JASDF_F-15J_take_off_in_formation.JPEG
                { name: "F-2", count: 91, type: "Multirole Fighter", description: "Japanese-developed fighter based on F-16 with AESA radar and ASM-2 anti-ship missiles", image: "Japan_details/Japan_airforce_details/f2.png" }, // src: https://en.wikipedia.org/wiki/Mitsubishi_F-2#/media/File:F-2A_(53-8535)_at_Tsuiki.jpg
                { name: "AH-64D Apache", count: 12, type: "Attack Helicopter", description: "Twin-engine attack helicopter with Longbow radar and Hellfire missiles", image: "Japan_details/Japan_airforce_details/ah64d_apache.png" } // src: https://en.wikipedia.org/wiki/Boeing_AH-64_Apache#/media/File:AH-64D_Apache_Longbow.jpg
            ]
        }
    },
    "SouthKorea": {
        name: "Republic Of Korea",
        flag: "🇰🇷",
        countryCode: "kr",
        rank: 6,
        budget: "$46.4B",
        nuclear: { status: false },
        personnel: { active: 500000, reserve: 3100000 },
        description: "The Republic of Korea Armed Forces maintain a massive standing army and reserve force to deter North Korea. South Korea is also a major defense exporter, selling the K2 tank, K9 howitzer, KF-21 fighter, and FA-50 trainer globally.",
        image: "ROK_details/ROK_flag.jpg",
        army: {
            tanks: 2130, apc: 5100, artillery: 6350, mlrs: 584,
            name: "Republic of Korea Army",
            founded: "September 5, 1948",
            motto: "Win in Every Battle",
            description: "The ROK Army is one of the largest and most well-equipped in the world, maintaining readiness against the North Korean threat. It has developed world-class indigenous weapons systems.",
            image: "ROK_details/ROK_army_flag.jpg",
            equipment: [
                { name: "K2 Black Panther", count: 260, type: "Main Battle Tank", description: "Advanced indigenous MBT with composite/ERA armor, 120mm gun, and active protection system", image: "ROK_details/ROK_army_details/k2_black_panther.png" }, // src: https://en.wikipedia.org/wiki/K2_Black_Panther#/media/File:U.S.,_ROK_forces_forge_interoperability_with_combined_arms_exercise_-_8_of_8.jpg
                { name: "K1A2", count: 1027, type: "Main Battle Tank", description: "Upgraded K1 MBT with improved fire control, thermal sights, and 120mm gun", image: "ROK_details/ROK_army_details/k1a2.png" }, // src: https://en.wikipedia.org/wiki/K1_tank#/media/File:%EC%9C%A1%EA%B5%B0_20%EC%82%AC%EB%8B%A8_K1A1%EA%B8%B0%EB%8F%99_(7445965714).jpg
                { name: "K21 IFV", count: 470, type: "Infantry Fighting Vehicle", description: "Amphibious IFV with 40mm autocannon and advanced digital fire control", image: "ROK_details/ROK_army_details/k21_ifv.png" }, // src: https://en.wikipedia.org/wiki/K21#/media/File:2014.5.20_%EC%9C%A1%EA%B5%B0_%EC%88%98%EB%8F%84%EA%B8%B0%EA%B3%84%ED%99%94%EB%B3%B4%EB%B3%91%EC%82%AC%EB%8B%A8_K-21_%EC%9E%A5%EA%B0%91%EC%B0%A8_%EC%A0%84%ED%88%AC%EC%82%AC%EA%B2%A9%ED%9B%88%EB%A0%A8_K-21_combat_firing_practice,_Republic_of_Korea_Army_Capital_Mechanized_Infantry_Division_(14299828042).jpg
                { name: "K9 Thunder", count: 1136, type: "Self-Propelled Howitzer", description: "155mm SPH exported to 8+ countries, known for exceptional rate of fire and accuracy", image: "ROK_details/ROK_army_details/k9_thunder.png" } // src: https://en.wikipedia.org/wiki/K9_Thunder#/media/File:2011.2.17_%EC%9C%A1%EA%B5%B06%ED%8F%AC%EB%B3%91%EC%97%AC%EB%8B%A8_k-9,k-55_%EC%9E%90%EC%A3%BC%ED%8F%AC%EC%82%AC%EA%B2%A9_(7633864346).jpg
            ]
        },
        navy: {
            carriers: 0, submarines: 19, destroyers: 12, frigates: 18,
            name: "Republic of Korea Navy",
            founded: "November 11, 1945",
            motto: "Protect the Seas, Serve the Nation",
            description: "The ROK Navy operates advanced Aegis destroyers, domestically-built submarines, and is developing a light aircraft carrier. It focuses on defending Korean waters and projecting power regionally.",
            image: "ROK_details/ROK_navy_flag.jpg",
            equipment: [
                { name: "Sejong the Great Destroyer", count: 3, type: "Guided Missile Destroyer", description: "KDX-III Aegis destroyer with 128 VLS cells for air defense and ballistic missile defense", image: "ROK_details/ROK_navy_details/sejong_the_great_destroyer.png" }, // src: https://en.wikipedia.org/wiki/Sejong_the_Great-class_destroyer#/media/File:ROKS_Sejong_the_Great_(DDG-991),_broadside_view_in_July_2010.jpg
                { name: "Son Won-il Submarine", count: 9, type: "Attack Submarine", description: "Type 214 AIP submarine with fuel cell propulsion for extended underwater operations", image: "ROK_details/ROK_navy_details/son_won_il_submarine.png" }, // src: https://en.wikipedia.org/wiki/ROKS_Sohn_Won-yil#/media/File:Key_Resolve_-_Foal_Eagle_2008.jpg
                { name: "Dosan Ahn Changho Submarine", count: 3, type: "Attack Submarine", description: "3,000-ton indigenous submarine with vertical launch system for cruise missiles", image: "ROK_details/ROK_navy_details/dosan_ahn_changho_submarine.png" }, // src: https://en.wikipedia.org/wiki/Dosan_Ahn_Changho-class_submarine#/media/File:ROKS_Dosan_Ahn_Changho_class_submarine.png
                { name: "Daegu-class Frigate", count: 8, type: "Guided Missile Frigate", description: "FFX-II multipurpose frigate with reduced radar signature and advanced sensors", image: "ROK_details/ROK_navy_details/daegu_class_frigate.png" } // src: https://en.wikipedia.org/wiki/Daegu-class_frigate#/media/File:ROKS_Seoul_(FFG-821)_underway_in_the_Yellow_Sea_during_the_commemoration_of_the_73rd_anniversary_of_the_Battle_of_Incheon_on_14_September_2023_(cropped).jpg
            ]
        },
        airforce: {
            fighters: 410, bombers: 0, transport: 70, helicopters: 740,
            name: "Republic of Korea Air Force",
            founded: "October 1, 1949",
            motto: "We Fly and Fight",
            description: "The ROKAF operates F-35A stealth fighters and is developing the indigenous KF-21 Boramae 4.5-gen fighter. It maintains a strong fighter force for air superiority over the Korean Peninsula.",
            image: "ROK_details/ROK_airforce_flag.jpg",
            equipment: [
                { name: "F-35A Lightning II", count: 60, type: "5th Gen Stealth Fighter", description: "Stealth multirole fighter enhancing ROKAF's air dominance and strike capabilities", image: "ROK_details/ROK_airforce_details/f35a_lightning_ii.png" }, // src: https://en.wikipedia.org/wiki/Lockheed_Martin_F-35_Lightning_II#/media/File:First_F-35_headed_for_USAF_service.jpg
                { name: "KF-21 Boramae", count: 6, type: "4.5 Gen Fighter", description: "Indigenous twin-engine fighter with AESA radar, first Korean-developed fighter jet", image: "ROK_details/ROK_airforce_details/kf21_boramae.png" }, // src: https://en.wikipedia.org/wiki/KAI_KF-21_Boramae#/media/File:KF-21_prototype_003_and_004_during_flight_testing.jpg
                { name: "F-15K Slam Eagle", count: 59, type: "Strike Fighter", description: "Twin-engine heavy strike fighter with SLAM-ER precision missiles", image: "ROK_details/ROK_airforce_details/f15k_slam_eagle.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/4/48/F-15K_%ED%9B%88%EB%A0%A8_%287438817442%29.jpg
                { name: "FA-50 Fighting Eagle", count: 60, type: "Light Combat Aircraft", description: "Korean-developed supersonic light fighter/trainer exported globally", image: "ROK_details/ROK_airforce_details/fa50_fighting_eagle.png" } // src: https://en.wikipedia.org/wiki/KAI_T-50_Golden_Eagle#/media/File:2014.10.8_%EA%B3%B5%EA%B5%B0_FA-50_Republic_of_Korea_Air_Force_(15361855407).jpg
            ]
        }
    },
    "Turkey": {
        name: "Turkey",
        flag: "🇹🇷",
        countryCode: "tr",
        rank: 11,
        budget: "$19.6B",
        nuclear: { status: false },
        personnel: { active: 425000, reserve: 378700 },
        description: "Turkey has NATO's second-largest military and has developed a robust indigenous defense industry producing drones, armored vehicles, and naval vessels. Turkish combat drones have changed the nature of modern warfare.",
        image: "Turkey_details/turkey_flag.png",
        army: {
            tanks: 2200, apc: 7550, artillery: 1430, mlrs: 350,
            name: "Turkish Land Forces",
            founded: "1920",
            motto: "Strong Army, Peaceful Nation",
            description: "The Turkish Land Forces are one of the largest armies in NATO, experienced in counterinsurgency operations. Turkey is developing the indigenous Altay main battle tank.",
            image: "Turkey_details/turkey_army_flag.png",
            equipment: [
                { name: "Leopard 2A4", count: 354, type: "Main Battle Tank", description: "German-built MBT with 120mm gun, the most modern tank in Turkish inventory", image: "Turkey_details/Turkey_army_details/leopard_2a4.png" }, // src: https://en.wikipedia.org/wiki/Leopard_2#/media/File:Dutch_Leopard_2A4_in_Defensive_Hull-down_Position_1997.jpg
                { name: "M60T Sabra", count: 170, type: "Main Battle Tank", description: "Israeli-upgraded M60 Patton with modern fire control and armor package", image: "Turkey_details/Turkey_army_details/m60t_sabra.png" }, // src: https://en.wikipedia.org/wiki/Sabra_(tank_upgrade_package)#/media/File:Sabra_tank.jpg
                { name: "Altay MBT", count: 20, type: "Main Battle Tank", description: "Indigenous next-gen MBT based on K2 Black Panther platform with local systems", image: "Turkey_details/Turkey_army_details/altay_mbt.png" }, // src:https://en.wikipedia.org/wiki/Altay_(tank)#/media/File:Altay_Tank.jpg
                { name: "T-155 Firtina", count: 350, type: "Self-Propelled Howitzer", description: "155mm SPH based on K9 Thunder platform, license-produced in Turkey", image: "Turkey_details/Turkey_army_details/t155_firtina.png" } // src: https://en.wikipedia.org/wiki/T-155_Firtina#/media/File:T-155F%C4%B1rt%C4%B1na_(1).jpg
            ]
        },
        navy: {
            carriers: 1, submarines: 12, destroyers: 0, frigates: 16,
            name: "Turkish Naval Forces",
            founded: "1920",
            motto: "Denizlerin Hakimi (Sovereign of the Seas)",
            description: "The Turkish Navy operates the TCG Anadolu amphibious assault ship designed to carry Bayraktar TB3 drones and F-35Bs. It operates advanced Type 214 submarines and indigenous MILGEM corvettes.",
            image: "Turkey_details/turkey_navy_flag.png",
            equipment: [
                { name: "TCG Anadolu LHD", count: 1, type: "Amphibious Assault Ship", description: "27,000-ton LHD serving as drone carrier for Bayraktar TB3 UCAVs", image: "Turkey_details/Turkey_navy_details/tcg_anadolu_lhd.png" }, // src: https://en.wikipedia.org/wiki/TCG_Anadolu#/media/File:Turkish_Navy_amphibious_assault_ship_TCG_Anadolu_(L400)_steams_in_the_Mediterranean_Sea.jpg
                { name: "Type 214 Submarine", count: 6, type: "Attack Submarine", description: "German-designed AIP submarine with fuel cell propulsion", image: "Turkey_details/Turkey_navy_details/type_214_submarine.png" }, // src: https://en.wikipedia.org/wiki/Type_214_submarine#/media/File:ROKS_Yun_Bonggil_(SS_077)_190605-N-SS370-0028.jpg
                { name: "Reis-class Submarine", count: 4, type: "Attack Submarine", description: "Extended Type 214 variant with indigenous combat systems", image: "Turkey_details/Turkey_navy_details/reis_class_submarine.png" }, // src: https://en.wikipedia.org/wiki/Reis-class_submarine#/media/File:Tcg-pirireis.jpg
                { name: "MILGEM Corvette", count: 8, type: "Anti-Submarine Corvette", description: "Indigenous stealth corvette with anti-submarine warfare capability", image: "Turkey_details/Turkey_navy_details/milgem_corvette.png" } // src: https://en.wikipedia.org/wiki/MILGEM_project#/media/File:TCG_%C4%B0stanbul_(F-515)_(cropped).jpg
            ]
        },
        airforce: {
            fighters: 305, bombers: 0, transport: 82, helicopters: 485,
            name: "Turkish Air Force",
            founded: "June 1, 1911",
            motto: "Yurtta Sulh, Cihanda Sulh (Peace at Home, Peace in the World)",
            description: "The Turkish Air Force operates F-16 fighters and is developing the indigenous KAAN 5th-gen stealth fighter. Turkey's Bayraktar drones have become a global sensation.",
            image: "Turkey_details/turkey_airforce_flag.png",
            equipment: [
                { name: "F-16 Fighting Falcon", count: 245, type: "Multirole Fighter", description: "Block 50+ variant with CCIP upgrades, backbone of Turkish airpower", image: "Turkey_details/Turkey_airforce_details/f16_fighting_falcon.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/8/83/Lockheed_Martin_F-16D_Fighting_Falcon%2C_Turkey_-_Air_Force_JP7156596.jpg
                { name: "TAI TF KAAN (Development)", count: 1, type: "5th Gen Stealth Fighter", description: "Indigenous twin-engine stealth fighter under development, first flown 2024", image: "Turkey_details/Turkey_airforce_details/tai_tf_kaan.png" }, // src: https://en.wikipedia.org/wiki/TAI_TF_Kaan#/media/File:IMG-TAI-TFX.jpg
                { name: "T129 ATAK", count: 60, type: "Attack Helicopter", description: "Turkish-Italian twin-engine attack helicopter with anti-tank missiles", image: "Turkey_details/Turkey_airforce_details/t129_atak.png" }, // src: https://en.wikipedia.org/wiki/TAI/AgustaWestland_T129_ATAK#/media/File:BG12-1001_(14662033896).jpg
                { name: "Bayraktar TB2", count: 200, type: "UCAV Drone", description: "Combat-proven medium-altitude UAV with MAM-L/MAM-C precision munitions", image: "Turkey_details/Turkey_airforce_details/bayraktar_tb2.png" } // src: https://en.wikipedia.org/wiki/Baykar_Bayraktar_TB2#/media/File:Bayraktar_TB2_Runway.jpg
            ]
        }
    },
    "NorthKorea": {
        name: "Democratic People's Republic of Korea",
        flag: "🇰🇵",
        countryCode: "kp",
        rank: 30,
        budget: "$4B (est.)",
        nuclear: { status: true, warheads: 50, type: "Confirmed" },
        personnel: { active: 1280000, reserve: 600000 },
        description: "The Korean People's Army is one of the world's largest military forces by personnel. Despite aging equipment, North Korea possesses nuclear weapons, ballistic missiles, and the world's largest artillery force positioned to threaten Seoul.",
        image: "DPRK_details/Northkorea_flag.png",
        army: {
            tanks: 5895, apc: 6000, artillery: 21100, mlrs: 5500,
            name: "Korean People's Army Ground Force",
            founded: "February 8, 1948",
            motto: "Defend the Fatherland",
            description: "The KPA Ground Force is the fourth-largest army in the world, maintaining massive artillery concentrations along the DMZ. Most equipment is Soviet/Chinese-origin from the Cold War era.",
            image: "DPRK_details/Northkorea_army_flag.png",
            equipment: [
                { name: "Chonma-ho", count: 1000, type: "Main Battle Tank", description: "Indigenous MBT derived from T-62 with local modifications and ERA armor", image: "DPRK_details/DPRK_army_details/chonma_ho.png" }, // src: https://en.wikipedia.org/wiki/Chonma-ho#/media/File:North_Korean_Chonma-ho_main_battle_tank.jpg
                { name: "Pokpung-ho", count: 200, type: "Main Battle Tank", description: "Most advanced North Korean tank combining T-72/Type 88 features with composite armor", image: "DPRK_details/DPRK_army_details/pokpung_ho.png" }, // src: https://en.wikipedia.org/wiki/Pokpung-ho#/media/File:North_Korea_Victory_Day_122_(9465927866)_(cropped).jpg
                { name: "T-62", count: 800, type: "Main Battle Tank", description: "Soviet-era tank with 115mm smoothbore gun, still in active frontline service", image: "DPRK_details/DPRK_army_details/t62.png" }, // src: https://en.wikipedia.org/wiki/T-62#/media/File:ParkPatriot2015part10-12.jpg
                { name: "Koksan SPG", count: 500, type: "Self-Propelled Gun", description: "170mm self-propelled gun with 60km range, capable of striking Seoul from the DMZ", image: "DPRK_details/DPRK_army_details/koksan_spg.png" } // src: https://en.wikipedia.org/wiki/M-1978_Koksan#/media/File:170mm_M1989_Koksan_-_North_Korea_Victory_Day-2013_01.jpg
            ]
        },
        navy: {
            carriers: 0, submarines: 83, destroyers: 0, frigates: 14,
            name: "Korean People's Navy",
            founded: "June 5, 1946",
            motto: "Defend the Coastal Waters",
            description: "The KPN operates one of the largest submarine fleets in the world, though mostly coastal midget and coastal submarines. It is developing submarine-launched ballistic missile capability.",
            image: "DPRK_details/Northkorea_navy_flag.png",
            equipment: [
                { name: "Sinpo-class Submarine", count: 3, type: "Ballistic Missile Submarine", description: "2,000-ton submarine capable of launching Pukguksong submarine-launched ballistic missiles", image: "DPRK_details/DPRK_navy_details/sinpo_class_submarine.png" }, // AI-generated image
                { name: "Romeo-class Submarine", count: 20, type: "Attack Submarine", description: "Soviet-designed diesel-electric submarine license-built in North Korea", image: "DPRK_details/DPRK_navy_details/romeo_class_submarine.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/4/48/Romeo_class_submarine.jpg
                { name: "Sang-O Submarine", count: 40, type: "Coastal Submarine", description: "Indigenous 325-ton coastal submarine for infiltration and mine-laying", image: "DPRK_details/DPRK_navy_details/sang_o_submarine.jpg" }, // src: https://en.wikipedia.org/wiki/Sang-O-class_submarine#/media/File:Gangneung_sub_8990.jpg
                { name: "Najin-class Frigate", count: 2, type: "Frigate", description: "1,500-ton escort frigate with anti-ship missiles and naval guns", image: "DPRK_details/DPRK_navy_details/najin_class_frigate.png" } // src: https://en.wikipedia.org/wiki/Najin-class_frigate#/media/File:North_Korean_Navy_corvette.jpg
            ]
        },
        airforce: {
            fighters: 458, bombers: 80, transport: 200, helicopters: 202,
            name: "Korean People's Air Force",
            founded: "August 20, 1947",
            motto: "Guard the Skies of the Revolution",
            description: "The KPAF operates one of the largest air forces in Asia by number, but most aircraft are obsolete Soviet and Chinese designs. The MiG-29 is the most modern fighter in service.",
            image: "DPRK_details/Northkorea_airforce_flag.png",
            equipment: [
                { name: "MiG-29", count: 40, type: "Air Superiority Fighter", description: "Most advanced NK fighter, 4th-gen twin-engine interceptor with limited modern weapons", image: "DPRK_details/DPRK_airforce_details/mig_29.png" }, // src: https://en.wikipedia.org/wiki/Mikoyan_MiG-29#/media/File:DPRK_MiG-29.jpg
                { name: "MiG-23", count: 56, type: "Interceptor", description: "Variable-geometry 3rd-gen fighter used for air defense and ground attack", image: "DPRK_details/DPRK_airforce_details/mig_23.png" }, // src: https://en.wikipedia.org/wiki/Mikoyan-Gurevich_MiG-23#/media/File:Mig-23-DNST8908431_JPG.jpg
                { name: "MiG-21", count: 150, type: "Light Interceptor", description: "Aging but numerous 2nd-gen supersonic fighter, backbone of KPAF", image: "DPRK_details/DPRK_airforce_details/mig_21.png" }, // src: https://en.wikipedia.org/wiki/Mikoyan-Gurevich_MiG-21#/media/File:Mikoyan-Gurevich_MiG-21PF_USAF.jpg
                { name: "Il-28 Beagle", count: 80, type: "Tactical Bomber", description: "Soviet-era twin-engine jet bomber capable of delivering nuclear weapons", image: "DPRK_details/DPRK_airforce_details/il_28_beagle.png" } // src: https://en.wikipedia.org/wiki/Ilyushin_Il-28#/media/File:038_Harbin_H-5_PLAAF_(3223304620).jpg
            ]
        }
    },
    "Italy": {
        name: "Italy",
        flag: "🇮🇹",
        countryCode: "it",
        rank: 10,
        budget: "$32.9B",
        nuclear: { status: false },
        personnel: { active: 175300, reserve: 20000 },
        description: "The Italian Armed Forces are a strong NATO member with significant naval and air capabilities. Italy is a key partner in European defense projects and maintains expeditionary forces deployed across the Mediterranean and beyond.",
        image: "Italy_details/italy_flag.jpg",
        army: {
            tanks: 200, apc: 4500, artillery: 108, mlrs: 22,
            name: "Italian Army (Esercito Italiano)",
            founded: "May 4, 1861",
            motto: "Per l'Italia (For Italy)",
            description: "The Italian Army is organized for rapid overseas deployment and NATO duties. It operates the Ariete MBT and the Centauro wheeled tank destroyer, optimized for rapid deployment in diverse terrains.",
            image: "Italy_details/italy_army_flag.png",
            equipment: [
                { name: "Ariete C1", count: 200, type: "Main Battle Tank", description: "Italian MBT with composite armor, 120mm smoothbore gun, and HITFIST turret", image: "Italy_details/Italy_army_details/ariete_c1.png" }, // src: https://en.wikipedia.org/wiki/Ariete#/media/File:Italian_Army_-_4th_Tank_Regiment_Ariete_main_battle_tanks_-_January_2023.jpg
                { name: "Centauro II", count: 150, type: "Wheeled Tank Destroyer", description: "8x8 wheeled armored vehicle with 120mm gun for rapid deployment", image: "Italy_details/Italy_army_details/centauro_ii.png" }, // src: https://en.wikipedia.org/wiki/Centauro_(Tank_destroyer)#/media/File:Centauro01.JPEG
                { name: "Freccia IFV", count: 249, type: "Infantry Fighting Vehicle", description: "8x8 wheeled IFV with 25mm Oerlikon autocannon and Spike ATGM", image: "Italy_details/Italy_army_details/freccia_ifv.png" }, // src: https://en.wikipedia.org/wiki/Freccia_IFV#/media/File:Italian_Army_-_Mechanized_Brigade_%22Pinerolo%22_Freccia_IFV.jpg
                { name: "PzH 2000", count: 70, type: "Self-Propelled Howitzer", description: "155mm tracked SPH jointly operated with German Army", image: "Italy_details/Italy_army_details/pzh_2000.png" } // src: https://en.wikipedia.org/wiki/Panzerhaubitze_2000#/media/File:Lithuanian_PzH_2000_(2).jpg
            ]
        },
        navy: {
            carriers: 2, submarines: 8, destroyers: 4, frigates: 11,
            name: "Italian Navy (Marina Militare)",
            founded: "March 17, 1861",
            motto: "Patria e Onore (Fatherland and Honor)",
            description: "The Marina Militare operates two aircraft carriers and a large fleet of FREMM frigates. Italy is a major naval shipbuilder through Fincantieri, supplying warships to navies worldwide.",
            image: "Italy_details/italy_navy_flag.png",
            equipment: [
                { name: "Cavour Carrier", count: 1, type: "Light Aircraft Carrier", description: "27,100-ton STOVL carrier operating F-35B and AV-8B Harrier", image: "Italy_details/Italy_navy_details/cavour_carrier.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/9/95/Italian_aircraft_carrier_Cavour.jpg
                { name: "Trieste LHD", count: 1, type: "Amphibious Assault Ship", description: "33,000-ton multi-role amphibious ship, largest Italian warship since WWII", image: "Italy_details/Italy_navy_details/trieste_lhd.png" }, // src: https://en.wikipedia.org/wiki/Italian_landing_helicopter_dock_Trieste#/media/File:Italian_LHD_Trieste.jpg
                { name: "Todaro-class Submarine", count: 4, type: "Attack Submarine", description: "Type 212A diesel-electric submarine with fuel cell AIP technology", image: "Italy_details/Italy_navy_details/todaro_class_submarine.png" }, // src: https://en.wikipedia.org/wiki/Type_212A_submarine#/media/File:Varotodaro.jpg
                { name: "FREMM Frigate", count: 10, type: "Multipurpose Frigate", description: "Franco-Italian frigate with anti-submarine and air defense variants", image: "Italy_details/Italy_navy_details/fremm_frigate.png" } // src: https://en.wikipedia.org/wiki/FREMM_multipurpose_frigate#/media/File:Nave_Bergamini_3.JPG
            ]
        },
        airforce: {
            fighters: 219, bombers: 0, transport: 32, helicopters: 326,
            name: "Italian Air Force (Aeronautica Militare)",
            founded: "March 28, 1923",
            motto: "Virtute Siderum Tenus (With Valor to the Stars)",
            description: "The Aeronautica Militare operates Eurofighter Typhoons and F-35 stealth fighters, and is a key participant in European air policing missions across NATO's southern flank.",
            image: "Italy_details/italy_airforce_flag.png",
            equipment: [
                { name: "F-35A/B Lightning II", count: 30, type: "5th Gen Stealth Fighter", description: "Stealth multirole fighter in both CTOL and STOVL variants for land and carrier operations", image: "Italy_details/Italy_airforce_details/f35a_lightning_ii.png" }, //src: https://upload.wikimedia.org/wikipedia/commons/8/82/Lockheed_Martin_F-35A_%26_B_Lightning_IIs_01_%2828275253796%29.jpg
                { name: "Eurofighter Typhoon", count: 94, type: "Multirole Fighter", description: "Twin-engine 4.5-gen fighter for air superiority, ground attack, and QRA duties", image: "Italy_details/Italy_airforce_details/eurofighter_typhoon.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/0/00/Eurofighter_Typhoon_EF2000%2C_Italy_-_Air_Force_JP6719032.jpg
                { name: "Tornado", count: 71, type: "Strike Fighter", description: "Variable-geometry interdictor/strike aircraft for deep strike missions", image: "Italy_details/Italy_airforce_details/tornado.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/1/17/6-41%2C_2024%2C_c-s%2C_Fairford%2C_Italy%2C_MM7067%2C_Tornado_IDS_-_9848_%2853998841366%29.jpg
                { name: "AW129 Mangusta", count: 48, type: "Attack Helicopter", description: "Italian twin-engine light attack helicopter with TOW missiles", image: "Italy_details/Italy_airforce_details/aw129_mangusta.png" } //src: https://en.wikipedia.org/wiki/Agusta_A129_Mangusta#/media/File:20150506052017!Agusta_A129A_Mangusta,_Italy_-_Army_(cropped).jpg
            ]
        }
    },
    "Poland": {
        name: "Poland",
        flag: "🇵🇱",
        countryCode: "pl",
        rank: 21,
        budget: "$31.6B",
        nuclear: { status: false },
        personnel: { active: 150000, reserve: 0 },
        description: "Poland is undertaking the largest military modernization in Europe, spending 4% of GDP on defense. It is acquiring K2 tanks, K9 howitzers, HIMARS, Abrams tanks, and F-35s to build NATO's strongest land force on the eastern flank.",
        image: "Poland_details/poland_flag.jpg",
        army: {
            tanks: 863, apc: 2600, artillery: 575, mlrs: 257,
            name: "Polish Land Forces",
            founded: "1918",
            motto: "Bóg, Honor, Ojczyzna (God, Honor, Fatherland)",
            description: "The Polish Land Forces are rapidly modernizing with Korean K2 tanks and K9 howitzers, and American Abrams M1A2 SEPv3 tanks. Poland aims to field Europe's most powerful army by 2030.",
            image: "Poland_details/poland_army_flag.png",
            equipment: [
                { name: "Leopard 2PL", count: 247, type: "Main Battle Tank", description: "Modernized Leopard 2A4 with upgraded fire control, armor, and thermal sights", image: "Poland_details/Poland_army_details/leopard_2pl.png" }, // src: https://en.wikipedia.org/wiki/Leopard_2PL#/media/File:Leopard_2PL_-_Szkolenie_Wojska_Polskiego_w_Nowej_D%C4%99bie_(cropped).jpg
                { name: "PT-91 Twardy", count: 232, type: "Main Battle Tank", description: "Polish-upgraded T-72M1 with ERA armor, new fire control system, and engine", image: "Poland_details/Poland_army_details/pt91_twardy.png" }, // src: https://en.wikipedia.org/wiki/PT-91_Twardy#/media/File:PT91_MSPO15_DSC02773.JPG
                { name: "K2 Black Panther", count: 180, type: "Main Battle Tank", description: "Korean MBT acquired for Poland's massive armored force expansion", image: "Poland_details/Poland_army_details/k2_black_panther.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/6/60/Polish_army_K2_Black_Panther.webp?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "K9 Thunder", count: 212, type: "Self-Propelled Howitzer", description: "155mm SPH acquired from South Korea to replace Soviet-era artillery", image: "Poland_details/Poland_army_details/k9_thunder.png" } // src: https://en.wikipedia.org/wiki/K9_Thunder#/media/File:2011.2.17_%EC%9C%A1%EA%B5%B06%ED%8F%AC%EB%B3%91%EC%97%AC%EB%8B%A8_k-9,k-55_%EC%9E%90%EC%A3%BC%ED%8F%AC%EC%82%AC%EA%B2%A9_(7633864346).jpg
            ]
        },
        navy: {
            carriers: 0, submarines: 3, destroyers: 0, frigates: 2,
            name: "Polish Navy",
            founded: "1918",
            motto: "Chwała Marynarce (Glory to the Navy)",
            description: "The Polish Navy operates in the Baltic Sea and is planning major modernization with new submarines and frigates under the Miecznik program.",
            image: "Poland_details/poland_navy_flag.jpg",
            equipment: [
                { name: "Orzel Submarine", count: 1, type: "Attack Submarine", description: "Kilo-class diesel-electric submarine for Baltic operations", image: "Poland_details/Poland_navy_details/orzel_submarine.png" }, // src: https://en.wikipedia.org/wiki/ORP_Orze%C5%82_%281986%29#/media/File:ORP_Orze%C5%82.JPG
                { name: "Kobben-class (Decommissioned)", count: 2, type: "Coastal Submarine", description: "Norwegian-origin coastal submarine for shallow water operations", image: "Poland_details/Poland_navy_details/kobben_class_submarine.png" }, // src: https://en.wikipedia.org/wiki/Kobben-class_submarine#/media/File:ORP_Bielik_7_powbiel_2.jpg
                { name: "Oliver H. Perry Frigate", count: 2, type: "Guided Missile Frigate", description: "US-transferred frigate with SM-1 missiles and anti-submarine capability", image: "Poland_details/Poland_navy_details/oliver_h_perry_frigate.png" }, // src: https://en.wikipedia.org/wiki/Oliver_Hazard_Perry-class_frigate#/media/File:Oliver_Hazard_Perry-class_frigates_underway_in_1982.JPEG
                { name: "Kormoran II Minehunter", count: 3, type: "Mine Countermeasures", description: "Modern mine countermeasures vessel with composite hull", image: "Poland_details/Poland_navy_details/kormoran_ii_minehunter.png" } // src: https://en.wikipedia.org/wiki/Kormoran_2-class_minehunter#/media/File:Pr%C3%B3by_morskie_ORP_%E2%80%9EKormoran%E2%80%9D.jpg
            ]
        },
        airforce: {
            fighters: 91, bombers: 0, transport: 47, helicopters: 160,
            name: "Polish Air Force",
            founded: "1918",
            motto: "Love Demands Sacrifice",
            description: "The Polish Air Force operates F-16 fighters and is transitioning to F-35A stealth fighters. It has also acquired FA-50 light fighters from South Korea.",
            image: "Poland_details/poland_airforce_flag.jpg",
            equipment: [
                { name: "F-16C/D", count: 48, type: "Multirole Fighter", description: "Block 52+ variant with conformal fuel tanks and advanced avionics", image: "Poland_details/Poland_airforce_details/f16_cd.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/5/59/F-16C_Poland_%2817149380631%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "FA-50", count: 48, type: "Light Combat Aircraft", description: "Korean-built supersonic trainer/light fighter for gap-fill role", image: "Poland_details/Poland_airforce_details/fa_50.png" }, // src: https://en.wikipedia.org/wiki/KAI_T-50_Golden_Eagle#/media/File:2014.10.8_%EA%B3%B5%EA%B5%B0_FA-50_Republic_of_Korea_Air_Force_(15361855407).jpg
                { name: "MiG-29", count: 28, type: "Air Superiority Fighter", description: "Soviet-era twin-engine interceptor, being retired in favor of F-35A", image: "Poland_details/Poland_airforce_details/mig_29.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/1/14/MiG-29_4103_Krzesiny_RB4.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "AW149", count: 32, type: "Medium Transport Helicopter", description: "Leonardo twin-engine multi-role helicopter for troop transport", image: "Poland_details/Poland_airforce_details/aw149.png" } // src: https://en.wikipedia.org/wiki/AgustaWestland_AW149#/media/File:AW-149_(52229093839).jpg
            ]
        }
    },
    "Ukraine": {
        name: "Ukraine",
        flag: "🇺🇦",
        countryCode: "ua",
        rank: 18,
        budget: "$8.9B",
        nuclear: { status: false },
        personnel: { active: 900000, reserve: 400000 },
        description: "The Armed Forces of Ukraine have become one of the most combat-experienced militaries in the world since 2022. They operate a mix of Soviet-era and Western-donated equipment and have pioneered modern drone warfare and combined arms tactics.",
        image: "Ukraine_details/ukraine_flag.jpg",
        army: {
            tanks: 1890, apc: 8400, artillery: 2200, mlrs: 491,
            name: "Ukrainian Ground Forces",
            founded: "December 6, 1991",
            motto: "For Honor! For Glory! For the People!",
            description: "The Ukrainian Ground Forces have been battle-hardened since 2022, employing a diverse mix of Soviet-legacy and Western-donated armor, artillery, and vehicles in combined arms warfare.",
            image: "Ukraine_details/ukraine_army_flag.jpg",
            equipment: [
                { name: "T-64BV", count: 600, type: "Main Battle Tank", description: "Soviet-era MBT with composite armor and 125mm gun, Ukraine's workhorse tank", image: "Ukraine_details/Ukraine_army_details/t64_bv.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/2/2a/T-64BV_mod.1987.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Leopard 2A6", count: 71, type: "Main Battle Tank", description: "German-donated advanced MBT with 120mm L55 gun and improved armor", image: "Ukraine_details/Ukraine_army_details/leopard_2a6.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/e/e1/UA_Leopard_2A6_05.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Challenger 2", count: 14, type: "Main Battle Tank", description: "British-donated MBT with Chobham armor, first Western tanks in Ukrainian service", image: "Ukraine_details/Ukraine_army_details/challenger_2.png" }, // src: https://en.wikipedia.org/wiki/Challenger_2#/media/File:Challenger_2_Main_Battle_Tank_patrolling_outside_Basra,_Iraq_MOD_45148325.jpg
                { name: "M109 Paladin", count: 45, type: "Self-Propelled Howitzer", description: "US-donated 155mm SPH providing long-range fire support with NATO ammunition", image: "Ukraine_details/Ukraine_army_details/m109_paladin.png" } // AI-generated image
            ]
        },
        navy: {
            carriers: 0, submarines: 0, destroyers: 0, frigates: 1,
            name: "Ukrainian Navy",
            founded: "April 1, 1992",
            motto: "Vira! (Heave-ho!)",
            description: "The Ukrainian Navy was largely destroyed when Russia seized Crimea but has rebuilt using fast attack craft and unmanned naval drones that have successfully struck Russian warships.",
            image: "Ukraine_details/ukraine_navy_flag.png",
            equipment: [
                { name: "Hetman Sahaidachny Frigate", count: 1, type: "Frigate", description: "Krivak III-class frigate, flagship of the Ukrainian Navy", image: "Ukraine_details/Ukraine_navy_details/hetman_sahaidachny_frigate.png" }, // src: https://en.wikipedia.org/wiki/Ukrainian_frigate_Hetman_Sahaidachny#/media/File:Ukrainian_navy_frigate_Hetman_Sahaidachnyi.jpg
                { name: "Gyurza-M Gunboat", count: 18, type: "Armored Gunboat", description: "Indigenous river/coastal gunboat with 30mm cannon and Barrier missiles", image: "Ukraine_details/Ukraine_navy_details/gyurza_m_gunboat.png" }, // src: https://en.wikipedia.org/wiki/Gyurza-M-class_gunboat#/media/File:%D0%9D%D0%BE%D0%B2%D0%BE%D0%B7%D0%B1%D1%83%D0%B4%D0%BE%D0%B2%D0%B0%D0%BD%D1%96_%D0%B4%D0%BB%D1%8F_%D1%83%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D1%81%D1%8C%D0%BA%D0%B8%D1%85_%D0%92%D0%9C%D0%A1_%D0%BC%D0%B0%D0%BB%D1%96_%D0%B1%D1%80%D0%BE%D0%BD%D1%8C%D0%BE%D0%B2%D0%B0%D0%BD%D1%96_%D0%B0%D1%80%D1%82%D0%B8%D0%BB%D0%B5%D1%80%D1%96%D0%B9%D1%81%D1%8C%D0%BA%D1%96_%D0%BA%D0%B0%D1%82%D0%B5%D1%80%D0%B8_%D0%B2_%D1%85%D0%BE%D0%B4%D1%96_%D0%B2%D0%B8%D0%BF%D1%80%D0%BE%D0%B1%D1%83%D0%B2%D0%B0%D0%BD%D1%8C_%D0%B7%D0%B4%D1%96%D0%B9%D1%81%D0%BD%D0%B8%D0%BB%D0%B8_%D1%81%D0%BF%D1%96%D0%BB%D1%8C%D0%BD%D0%B5_%D0%BF%D0%BB%D0%B0%D0%B2%D0%B0%D0%BD%D0%BD%D1%8F_(27359525951).jpg
                { name: "Island-class Cutter", count: 2, type: "Patrol Boat", description: "US Coast Guard-transferred patrol boats for coastal defense", image: "Ukraine_details/Ukraine_navy_details/island_class_cutter.png" }, // src: https://en.wikipedia.org/wiki/Island-class_patrol_boat#/media/File:USCGC_Knight_island.jpg
                { name: "Centaur Assault Boat", count: 15, type: "Assault Craft", description: "Indigenous high-speed landing craft for riverine and coastal operations", image: "Ukraine_details/Ukraine_navy_details/centaur_assault_boat.png" } // https://en.wikipedia.org/wiki/Centaur-class_fast_assault_craft#/media/File:Centaur-class_landing_boats,_2018,_02.jpg
            ]
        },
        airforce: {
            fighters: 67, bombers: 0, transport: 52, helicopters: 112,
            name: "Ukrainian Air Force",
            founded: "March 17, 1992",
            motto: "Proud to Serve the Fatherland",
            description: "The Ukrainian Air Force operates Soviet-era fighters supplemented by incoming F-16s from Western allies. It has maintained air defense despite facing a much larger Russian air force.",
            image: "Ukraine_details/ukraine_airforce_flag.jpg",
            equipment: [
                { name: "MiG-29", count: 32, type: "Air Superiority Fighter", description: "Soviet 4th-gen twin-engine interceptor, augmented with Western-donated units", image: "Ukraine_details/Ukraine_airforce_details/mig_29.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/3/3f/Ukrainian-Air-Force-MiG-29-1280x720.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Su-27", count: 20, type: "Air Superiority Fighter", description: "Heavy twin-engine fighter for air defense and escort missions", image: "Ukraine_details/Ukraine_airforce_details/su_27.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/e/e5/Sukhoi_Su-27_-_B-1831M1_-_Radom_Air_Show_-_20180825_1531_5818_DxO.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Su-24", count: 12, type: "Attack Aircraft", description: "Variable-geometry strike bomber adapted for Storm Shadow cruise missiles", image: "Ukraine_details/Ukraine_airforce_details/su_24.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/d/de/Ukrainian_su-24.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "F-16", count: 80, type: "Multirole Fighter", description: "Western 4th-gen fighter being delivered from Denmark, Netherlands, and Norway", image: "Ukraine_details/Ukraine_airforce_details/f_16.png" } // src: https://upload.wikimedia.org/wikipedia/commons/3/35/F-16AM_Ukrainian_Air_Force_during_take_off.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
            ]
        }
    },
    "Spain": {
        name: "Spain",
        flag: "🇪🇸",
        countryCode: "es",
        rank: 19,
        budget: "$20.3B",
        nuclear: { status: false },
        personnel: { active: 122550, reserve: 15000 },
        description: "The Spanish Armed Forces focus on Mediterranean security and maintain expeditionary capabilities. Spain operates the Juan Carlos I LHD and is building the new S-80 submarine class, the largest conventional submarine in Europe.",
        image: "Spain_details/spain_flag.jpg",
        army: {
            tanks: 327, apc: 2000, artillery: 96, mlrs: 0,
            name: "Spanish Army (Ejército de Tierra)",
            founded: "1482",
            motto: "La Patria, Mi Honor (The Fatherland, My Honor)",
            description: "The Spanish Army operates Leopard 2 tanks and is modernizing with new IFVs. It contributes to NATO missions and EU battlegroups.",
            image: "Spain_details/spain_army_flag.png",
            equipment: [
                { name: "Leopard 2E", count: 239, type: "Main Battle Tank", description: "Spanish-built variant of Leopard 2A6 with local fire control upgrades", image: "Spain_details/Spain_army_details/leopard_2e.png" }, // src: https://en.wikipedia.org/wiki/Leopard_2E#/media/File:TRJE_15_(21953221094).jpg
                { name: "Leopard 2A4", count: 108, type: "Main Battle Tank", description: "Earlier Leopard 2 variant used as reserve and training tank", image: "Spain_details/Spain_army_details/leopard_2a4.png" }, // src: https://en.wikipedia.org/wiki/Leopard_2E#/media/File:Leopard_2A4_E._T..JPG
                { name: "Pizarro IFV", count: 212, type: "Infantry Fighting Vehicle", description: "Spanish variant of ASCOD IFV with 30mm autocannon", image: "Spain_details/Spain_army_details/pizarro_ifv.png" }, // src: https://en.wikipedia.org/wiki/ASCOD#/media/File:Trident_Juncture_2018_181103-M-RI194-005.jpg
                { name: "Centauro", count: 84, type: "Wheeled Tank Destroyer", description: "Italian 8x8 wheeled armored vehicle with 105mm gun for rapid deployment", image: "Spain_details/Spain_army_details/centauro.png" } // src: https://en.wikipedia.org/wiki/Centauro_(Tank_destroyer)#/media/File:Centauro01.JPEG
            ]
        },
        navy: {
            carriers: 1, submarines: 4, destroyers: 0, frigates: 11,
            name: "Spanish Navy (Armada Española)",
            founded: "1248",
            motto: "Pro Maris Liberis (For Free Seas)",
            description: "The Armada Española operates the Juan Carlos I multipurpose assault ship and is deploying new S-80 Plus submarines. Spain is one of Europe's major naval powers in the Mediterranean.",
            image: "Spain_details/spain_navy_flag.png",
            equipment: [
                { name: "Juan Carlos I LHD", count: 1, type: "Amphibious Assault Ship", description: "26,000-ton LHD capable of operating AV-8B Harrier and F-35B fighters", image: "Spain_details/Spain_navy_details/juan_carlos_i_lhd.png" }, // src: https://en.wikipedia.org/wiki/Spanish_ship_Juan_Carlos_I#/media/File:Spanish_amphibious_assault_ship_Juan_Carlos_I_(L-61)_underway_in_the_Adriatic_Sea,_22_February_2023_(230222-N-MW880-1248).JPG
                { name: "S-80 Plus Submarine", count: 4, type: "Attack Submarine", description: "Indigenous AIP submarine, largest conventional sub in Europe at 3,000 tons", image: "Spain_details/Spain_navy_details/s80_plus_submarine.png" }, // src: https://en.wikipedia.org/wiki/S-80_Plus-class_submarine#/media/File:Whale_Watching,_Cartagena_Spain_-_Flickr_-_A_Guy_Named_Nyal.jpg
                { name: "Álvaro de Bazán Frigate", count: 5, type: "Aegis Frigate", description: "F100-class Aegis combat system frigate with SPY-1D radar", image: "Spain_details/Spain_navy_details/alvaro_de_bazan_frigate.png" }, // src: https://en.wikipedia.org/wiki/%C3%81lvaro_de_Baz%C3%A1n-class_frigate#/media/File:Fragata_F-101_%22%C3%81lvaro_de_Baz%C3%A1n%22_fondeada_en_la_R%C3%ADa_de_Pontevedra_(14694192716).jpg
                { name: "Santa María Frigate", count: 6, type: "Guided Missile Frigate", description: "Spanish variant of US Oliver Hazard Perry-class with SM-1 missiles", image: "Spain_details/Spain_navy_details/santa_maria_frigate.png" } // src: https://en.wikipedia.org/wiki/Santa_Mar%C3%ADa-class_frigate#/media/File:F81_SPS_Santa_Mar%C3%ADa.jpg
            ]
        },
        airforce: {
            fighters: 136, bombers: 0, transport: 52, helicopters: 134,
            name: "Spanish Air Force (Ejército del Aire)",
            founded: "October 7, 1939",
            motto: "Per Aspera ad Astra (Through Hardship to the Stars)",
            description: "The Spanish Air Force operates Eurofighter Typhoons and EF-18 Hornets for air defense. It participates in NATO air policing missions and is a partner in the FCAS future fighter program.",
            image: "Spain_details/spain_airforce_flag.png",
            equipment: [
                { name: "Eurofighter Typhoon", count: 70, type: "Multirole Fighter", description: "Twin-engine 4.5-gen fighter for air superiority and QRA missions", image: "Spain_details/Spain_airforce_details/eurofighter_typhoon.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/e/ee/Eurofighter_Typhoon_Spanish_Air_Force.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "EF-18 Hornet", count: 66, type: "Multirole Fighter", description: "US-designed twin-engine fighter adapted for Spanish operations", image: "Spain_details/Spain_airforce_details/ef18_hornet.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/1/18/EF-18_Hornet_Tiger_Meet.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "A400M Atlas", count: 14, type: "Strategic Transport", description: "Four-engine turboprop transport, assembled at the Seville AIRBUS plant", image: "Spain_details/Spain_airforce_details/a400m_atlas.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/3/3a/Airbus_A400M_Atlas_of_the_Spanish_Air_Force_%28code_EC-400%29_arrives_RIAT_Fairford_18July2019_arp.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Tiger HAD", count: 24, type: "Attack Helicopter", description: "Eurocopter attack helicopter with anti-tank and fire-support capability", image: "Spain_details/Spain_airforce_details/tiger_had.png" } // src: https://upload.wikimedia.org/wikipedia/commons/a/a5/Spanish_Army_Eurocopter_Tiger_HAD_on_USS_Kearsarge_%28LHD-3%29_in_April_2016.JPG?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
            ]
        }
    },
    "Netherlands": {
        name: "Netherlands",
        flag: "🇳🇱",
        countryCode: "nl",
        rank: 25,
        budget: "$15.6B",
        nuclear: { status: false },
        personnel: { active: 42000, reserve: 5000 },
        description: "The Royal Netherlands Armed Forces punch above their weight with advanced F-35 fighters, Apache helicopters, and a capable navy. The Netherlands closely cooperates with Germany in the 1 (German/Netherlands) Corps.",
        image: "Netherlands_details/netherlands_flag.jpg",
        army: {
            tanks: 18, apc: 1400, artillery: 54, mlrs: 22,
            name: "Royal Netherlands Army",
            founded: "January 9, 1814",
            motto: "Je Maintiendrai (I Will Maintain)",
            description: "The Royal Netherlands Army focuses on mechanized infantry and airmobile operations. It closely integrates with the German Bundeswehr under joint formations.",
            image: "Netherlands_details/netherlands_army_flag.jpg",
            equipment: [
                { name: "Leopard 2A6 (leased)", count: 18, type: "Main Battle Tank", description: "German MBT leased from Germany for training and NATO commitments", image: "Netherlands_details/Netherlands_army_details/leopard_2a6.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/5/54/Leopard_2A6_Klietz_2018.jpg
                { name: "CV90", count: 145, type: "Infantry Fighting Vehicle", description: "Swedish IFV with 35mm Bushmaster III cannon and advanced protection", image: "Netherlands_details/Netherlands_army_details/cv90.png" }, // src: https://en.wikipedia.org/wiki/Combat_Vehicle_90#/media/File:Stridsfordon_90_Revinge_2012-2.jpg
                { name: "Boxer", count: 200, type: "Armored Personnel Carrier", description: "8x8 modular wheeled APC jointly developed with Germany", image: "Netherlands_details/Netherlands_army_details/boxer.png" }, // src: https://en.wikipedia.org/wiki/Boxer_(armoured_fighting_vehicle)#/media/File:DSCN7330-crop_-_Copy.jpg
                { name: "PzH 2000", count: 54, type: "Self-Propelled Howitzer", description: "155mm SPH shared with German forces in joint formations", image: "Netherlands_details/Netherlands_army_details/pzh_2000.png" } // src: https://en.wikipedia.org/wiki/Panzerhaubitze_2000#/media/File:Lithuanian_PzH_2000_(2).jpg
            ]
        },
        navy: {
            carriers: 0, submarines: 4, destroyers: 0, frigates: 6,
            name: "Royal Netherlands Navy",
            founded: "January 11, 1488",
            motto: "Patet Omnibus Mare (The Sea is Open to All)",
            description: "The Royal Netherlands Navy operates globally with De Zeven Provinciën-class frigates, Walrus-class submarines, and the Karel Doorman joint support ship.",
            image: "Netherlands_details/netherlands_navy_flag.png",
            equipment: [
                { name: "Walrus-class Submarine", count: 4, type: "Attack Submarine", description: "Diesel-electric submarine with advanced sonar and torpedo systems", image: "Netherlands_details/Netherlands_navy_details/walrus_class_submarine.png" }, // src: https://en.wikipedia.org/wiki/Walrus-class_submarine#/media/File:4_walrusklasse_onderzeeboten.jpg
                { name: "De Zeven Provinciën Frigate", count: 4, type: "Air Defence Frigate", description: "LCF-class frigate with Thales SMART-L radar and SM-2 missiles", image: "Netherlands_details/Netherlands_navy_details/de_zeven_provincien_frigate.png" }, // src: https://en.wikipedia.org/wiki/De_Zeven_Provinci%C3%ABn-class_frigate#/media/File:HNLMS_De_Zeven_Provincien_(F802).jpg
                { name: "Karel Doorman JSS", count: 1, type: "Joint Support Ship", description: "28,000-ton logistics and amphibious support ship with helicopter deck", image: "Netherlands_details/Netherlands_navy_details/karel_doorman_jss.png" }, // src: https://en.wikipedia.org/wiki/HNLMS_Karel_Doorman_(A833)#/media/File:HNLMS_Karel_Doorman,_Starboard_Bow,_04.09.2017.jpg
                { name: "Holland-class OPV", count: 4, type: "Offshore Patrol Vessel", description: "3,750-ton ocean-going patrol vessel for constabulary and maritime security", image: "Netherlands_details/Netherlands_navy_details/holland_class_opv.png" } // src: https://en.wikipedia.org/wiki/Holland-class_patrol_vessel#/media/File:HNLMS_Holland.jpg
            ]
        },
        airforce: {
            fighters: 52, bombers: 0, transport: 4, helicopters: 45,
            name: "Royal Netherlands Air Force",
            founded: "July 1, 1913",
            motto: "Luctandum et Vigilandum (Strive and Watch)",
            description: "The Royal Netherlands Air Force is transitioning entirely to the F-35A, making it one of the first NATO air forces to operate an all-stealth fighter fleet.",
            image: "Netherlands_details/netherlands_airforce_flag.jpg",
            equipment: [
                { name: "F-35A Lightning II", count: 52, type: "5th Gen Stealth Fighter", description: "Stealth multirole fighter replacing F-16, nuclear-sharing capable", image: "Netherlands_details/Netherlands_airforce_details/f35a_lightning_ii.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/9/90/Royal_Netherlands_Air_Force%2C_Lockheed_Martin_F-35A_Lightning_II%2C_F-002_-_2016_KLu_Open_Dagen.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "C-130H Hercules", count: 4, type: "Tactical Transport", description: "Four-engine turboprop tactical transport for air logistics", image: "Netherlands_details/Netherlands_airforce_details/c130h_hercules.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/7/72/Lockheed_C-130H_Hercules%2C_Netherlands_-_Royal_Air_Force_JP6636229.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "AH-64E Apache", count: 28, type: "Attack Helicopter", description: "Latest Apache variant with improved sensors and Longbow radar", image: "Netherlands_details/Netherlands_airforce_details/ah_64e_apache.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/e/e8/Netherlands_Air_Force_AH-64E_Apache_%285%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "CH-47F Chinook", count: 14, type: "Heavy Transport Helicopter", description: "Twin-rotor heavy-lift helicopter for troop and cargo transport", image: "Netherlands_details/Netherlands_airforce_details/ch_47f_chinook.png" } // src: https://upload.wikimedia.org/wikipedia/commons/8/85/Dutch_CH-47_Chinook_in_Iraq_in_2024_-_CH-47F_MYII_CAAS_-_6.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
            ]
        }
    },
    "Sweden": {
        name: "Sweden",
        flag: "🇸🇪",
        countryCode: "se",
        rank: 31,
        budget: "$9.7B",
        nuclear: { status: false },
        personnel: { active: 24000, reserve: 32000 },
        description: "Sweden is NATO's newest major member, bringing advanced indigenous defense systems including the Gripen fighter, the CV90 IFV, and the Gotland-class submarine that famously 'sank' a US carrier in exercises.",
        image: "Sweden_details/sweden_flag.jpg",
        army: {
            tanks: 120, apc: 600, artillery: 48, mlrs: 24,
            name: "Swedish Army (Armén)",
            founded: "1521",
            motto: "Skyldighet framför allt (Duty Before All)",
            description: "The Swedish Army specializes in Nordic and Arctic warfare. It produces world-class armored vehicles including the CV90 IFV, exported to 7 countries, and the Archer artillery system.",
            image: "Sweden_details/sweden_army_flag.png",
            equipment: [
                { name: "Stridsvagn 122 (Leopard 2)", count: 120, type: "Main Battle Tank", description: "Swedish Leopard 2A5 variant with additional composite armor and French thermal sights", image: "Sweden_details/Sweden_army_details/stridsvagn_122.png" }, // src: https://en.wikipedia.org/wiki/Stridsvagn_122#/media/File:20260622_mss_robkru01_strv123-a_rollout_149-webb.jpg
                { name: "CV90", count: 509, type: "Infantry Fighting Vehicle", description: "Indigenous tracked IFV family in multiple variants — exported to 7+ nations", image: "Sweden_details/sweden_army_details/cv90.png" }, // src: https://en.wikipedia.org/wiki/Combat_Vehicle_90#/media/File:Stridsfordon_90_Revinge_2012-2.jpg
                { name: "Patria AMV", count: 113, type: "Armored Personnel Carrier", description: "Finnish 8x8 wheeled APC used for troop transport and fire support", image: "Sweden_details/sweden_army_details/patria_amv.png" }, // src: https://en.wikipedia.org/wiki/Patria_AMV#/media/File:Pansarterr%C3%A4ngbil_360_Revinge_2015-7.jpg
                { name: "Archer SPG", count: 48, type: "Self-Propelled Howitzer", description: "155mm wheeled SPH with automated loading, shoot-and-scoot capability in 30 seconds", image: "Sweden_details/sweden_army_details/archer_spg.png" } // src: https://upload.wikimedia.org/wikipedia/commons/e/ef/Dynamic_Front_25_in_Finland_-_Swedish_Army_Artillery_Battery_BAE_Bofors_Archer_Howitzer_%286%29.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
            ]
        },
        navy: {
            carriers: 0, submarines: 5, destroyers: 0, frigates: 0,
            name: "Swedish Navy (Marinen)",
            founded: "1522",
            motto: "With Strength and Vigilance",
            description: "The Swedish Navy specializes in Baltic Sea littoral warfare with world-class stealth corvettes and submarines. The Gotland-class submarine is legendary for defeating US carrier groups in exercises.",
            image: "Sweden_details/sweden_navy_flag.png",
            equipment: [
                { name: "Gotland-class Submarine", count: 2, type: "Attack Submarine", description: "World's first AIP submarine with Stirling engines — famously 'sank' USS Ronald Reagan in exercises", image: "Sweden_details/sweden_navy_details/gotland_class_submarine.png" }, // src: https://en.wikipedia.org/wiki/Gotland-class_submarine#/media/File:HMS_Gotland_-_Ystad-2015.jpg
                { name: "Blekinge-class Submarine", count: 2, type: "Attack Submarine", description: "Next-gen submarine replacing Gotland with enhanced stealth and endurance", image: "Sweden_details/sweden_navy_details/blekinge_class_submarine.png" }, // src: AI-Generated image
                { name: "Visby-class Corvette", count: 5, type: "Stealth Corvette", description: "Carbon-fiber stealth corvette with minimal radar signature for littoral warfare", image: "Sweden_details/sweden_navy_details/visby_class_corvette.png" }, // src: https://en.wikipedia.org/wiki/Visby-class_corvette#/media/File:HMS_Helsingborg_2.jpg
                { name: "Luleå-class Frigate", count: 2, type: "Frigate", description: "Frigate vessel for offensive and defensive warfare operations in the Baltic", image: "Sweden_details/sweden_navy_details/lulea_class_frigate.png" } // src: https://en.wikipedia.org/wiki/Lule%C3%A5-class_frigate#/media/File:FDI_Ronarch_par_BCR_Somme.jpg
            ]
        },
        airforce: {
            fighters: 98, bombers: 0, transport: 8, helicopters: 48,
            name: "Swedish Air Force (Flygvapnet)",
            founded: "July 1, 1926",
            motto: "Med Vingarna Som Vapen (With Wings as Weapons)",
            description: "The Flygvapnet operates the indigenous Gripen fighter, designed for dispersed highway operations in wartime. The Gripen is one of the most cost-effective fighters in the world.",
            image: "Sweden_details/sweden_airforce_flag.png",
            equipment: [
                { name: "JAS 39 Gripen C/D", count: 71, type: "Multirole Fighter", description: "Swedish single-engine fighter designed for highway operations and rapid turnaround", image: "Sweden_details/sweden_airforce_details/jas39_gripen_cd.png" }, // src: https://en.wikipedia.org/wiki/Saab_JAS_39_Gripen#/media/File:Saab_JAS_39_Gripen_at_Kaivopuisto_Air_Show,_June_2017_(altered)_copy.jpg
                { name: "JAS 39 Gripen E", count: 27, type: "Multirole Fighter", description: "Latest Gripen variant with AESA radar, increased range, and new avionics", image: "Sweden_details/sweden_airforce_details/jas39_gripen_e.png" }, // src: https://en.wikipedia.org/wiki/Saab_JAS_39_Gripen#/media/File:Saab_JAS-39_Gripen_(53079484003).jpg
                { name: "C-130H Hercules", count: 6, type: "Tactical Transport", description: "Four-engine tactical transport for air logistics and parachute operations", image: "Sweden_details/sweden_airforce_details/c130h_hercules.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/a/a4/C-130H_Sweden_%2826973417290%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "UH-60M Black Hawk", count: 15, type: "Utility Helicopter", description: "American medium-lift helicopter for troop transport and medevac", image: "Sweden_details/sweden_airforce_details/uh60m_black_hawk.png" } // src: https://upload.wikimedia.org/wikipedia/commons/3/32/Black_Hawk_01.JPG?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
            ]
        }
    },
    "Australia": {
        name: "Australia",
        flag: "🇦🇺",
        countryCode: "au",
        rank: 13,
        budget: "$32.3B",
        nuclear: { status: false },
        personnel: { active: 58600, reserve: 29560 },
        description: "The Australian Defence Force is modernizing rapidly under AUKUS, acquiring nuclear-powered submarines, long-range missiles, and expanding its F-35 fleet. Australia is a key US ally in the Indo-Pacific region.",
        image: "Australia_details/australia_flag.jpg",
        army: {
            tanks: 59, apc: 1600, artillery: 75, mlrs: 0,
            name: "Australian Army",
            founded: "March 1, 1901",
            motto: "By Land",
            description: "The Australian Army is modernizing under the LAND 400 program, replacing aging vehicles with Boxer CRV and acquiring HIMARS for long-range strike capability.",
            image: "Australia_details/australia_army_flag.jpg",
            equipment: [
                { name: "M1A2 Abrams", count: 59, type: "Main Battle Tank", description: "US-built MBT with depleted uranium armor and 120mm smoothbore gun", image: "Australia_details/australia_army_details/m1a2_abrams.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/b/ba/1AD_and_Australian_Army%27s_3rd_Brigade_conduct_combine_arms_live_fire_exercise_%287965533%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "ASLAV", count: 257, type: "Light Armored Vehicle", description: "8x8 wheeled reconnaissance vehicle based on LAV-25 platform", image: "Australia_details/australia_army_details/aslav.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/2/2f/ASLAV_1.JPG?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Boxer CRV", count: 211, type: "Combat Reconnaissance Vehicle", description: "8x8 modular wheeled vehicle replacing ASLAV under LAND 400 Phase 2", image: "Australia_details/australia_army_details/boxer_crv.png" }, // src: https://en.wikipedia.org/wiki/Boxer_(armoured_fighting_vehicle)#/media/File:DSCN7330-crop_-_Copy.jpg
                { name: "M777 Howitzer", count: 54, type: "Towed Howitzer", description: "Ultra-lightweight 155mm towed howitzer with titanium and aluminum construction", image: "Australia_details/australia_army_details/m777_howitzer.png" } // src: https://upload.wikimedia.org/wikipedia/commons/7/73/MRF-D_Marines_provide_artillery_support_during_Exercise_Koolendong_2019_%285715381%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
            ]
        },
        navy: {
            carriers: 2, submarines: 6, destroyers: 3, frigates: 8,
            name: "Royal Australian Navy",
            founded: "July 10, 1911",
            motto: "Per Mare Per Terram (By Sea By Land)",
            description: "The RAN is set for massive expansion under AUKUS, acquiring SSN-AUKUS nuclear attack submarines. It currently operates Hobart-class Aegis destroyers and Collins-class submarines.",
            image: "Australia_details/australia_navy_flag.jpg",
            equipment: [
                { name: "Canberra-class LHD", count: 2, type: "Amphibious Assault Ship", description: "27,000-ton landing helicopter dock based on Spanish Juan Carlos I design", image: "Australia_details/australia_navy_details/canberra_class_lhd.png" }, // src: https://en.wikipedia.org/wiki/Canberra-class_landing_helicopter_dock#/media/File:HMAS_Adelaide_at_Pearl_Harbor_in_July_2018.jpg
                { name: "Collins-class Submarine", count: 6, type: "Attack Submarine", description: "Diesel-electric submarine being replaced by AUKUS nuclear-powered subs", image: "Australia_details/australia_navy_details/collins_class_submarine.png" }, // src: https://en.wikipedia.org/wiki/Collins-class_submarine#/media/File:HMAS_Rankin_2006.jpg
                { name: "Hobart-class Destroyer", count: 3, type: "Aegis Destroyer", description: "Air warfare destroyer with Aegis combat system and SM-2 missiles", image: "Australia_details/australia_navy_details/hobart_class_destroyer.png" }, // src: https://en.wikipedia.org/wiki/Hobart-class_destroyer#/media/File:HMAS_Hobart_December_2017.jpg
                { name: "Anzac-class Frigate", count: 8, type: "General Purpose Frigate", description: "MEKO 200-based frigate being replaced by Hunter-class frigates", image: "Australia_details/australia_navy_details/anzac_class_frigate.png" } // src: https://en.wikipedia.org/wiki/Anzac-class_frigate#/media/File:HMAS_Ballarat_during_RIMPAC_2016.jpg
            ]
        },
        airforce: {
            fighters: 79, bombers: 0, transport: 34, helicopters: 155,
            name: "Royal Australian Air Force",
            founded: "March 31, 1921",
            motto: "Per Ardua Ad Astra (Through Adversity to the Stars)",
            description: "The RAAF operates the largest F-35A fleet outside the US and is the only country operating the EA-18G Growler electronic warfare aircraft besides America.",
            image: "Australia_details/australia_airforce_flag.jpg",
            equipment: [
                { name: "F-35A Lightning II", count: 72, type: "5th Gen Stealth Fighter", description: "Stealth multirole fighter — Australia's primary air superiority platform", image: "Australia_details/Australia_airforce_details/f35a_lightning_ii.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/4/4c/First_Australian_F-35A_arriving_at_Luke_AFB_in_December_2014.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "F/A-18F Super Hornet", count: 24, type: "Multirole Fighter", description: "Twin-engine naval fighter serving as bridge capability before full F-35 transition", image: "Australia_details/Australia_airforce_details/fa_18f_super_hornet.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/0/02/A44-203_Boeing_F-A-18F_Super_Hornet_RAAF_%2811676273224%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "EA-18G Growler", count: 11, type: "Electronic Warfare Aircraft", description: "Specialized electronic attack aircraft — only non-US operator globally", image: "Australia_details/Australia_airforce_details/ea_18g_growler.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/b/b4/Australian_EA-18G_at_Joint_Base_Pearl_Harbor-Hickam_in_2017.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "MRH-90 Taipan", count: 41, type: "Medium Transport Helicopter", description: "NH90 variant for tactical troop transport and logistics", image: "Australia_details/Australia_airforce_details/mrh_90_taipan.png" } // src: https://en.wikipedia.org/wiki/NHIndustries_MRH-90_Taipan#/media/File:Australian_Army_(A40-003)_NHI_MRH-(cropped).jpg
            ]
        }
    },
    "Israel": {
        name: "Israel",
        flag: "🇮🇱",
        countryCode: "il",
        rank: 17,
        budget: "$24.4B",
        nuclear: { status: true, warheads: 90, type: "Undeclared" },
        personnel: { active: 173000, reserve: 465000 },
        description: "The Israel Defense Forces are among the most combat-experienced and technologically advanced in the world. Israel has pioneered Iron Dome, Trophy APS, and has an undeclared nuclear arsenal. Mandatory conscription ensures a massive reserve force.",
        image: "Israel_details/israel_flag.jpg",
        army: {
            tanks: 1370, apc: 8500, artillery: 650, mlrs: 100,
            name: "Israel Defense Forces - Ground Command",
            founded: "May 26, 1948",
            motto: "Israel's Shield",
            description: "The IDF Ground Command operates the world-renowned Merkava MBT series and Namer IFV, both featuring revolutionary front-engine design and Trophy active protection system.",
            image: "Israel_details/israel_army_flag.jpg",
            equipment: [
                { name: "Merkava IV", count: 660, type: "Main Battle Tank", description: "Israel's indigenous MBT with Trophy APS, front-mounted engine, and troop compartment", image: "Israel_details/Israel_army_details/merkava_iv.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/a/af/The_Merkava_IV_Tank_in_the_7th_Armored_Brigade_%2815128364843%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Merkava III", count: 400, type: "Main Battle Tank", description: "Earlier Merkava variant still in active service with modular armor", image: "Israel_details/Israel_army_details/merkava_iii.png" }, // src: https://en.wikipedia.org/wiki/Merkava#/media/File:Merkava3dKasag001.jpg
                { name: "Namer IFV", count: 200, type: "Infantry Fighting Vehicle", description: "World's heaviest IFV based on Merkava hull with Trophy APS and 60-ton weight", image: "Israel_details/Israel_army_details/namer_ifv.png" }, // src: https://en.wikipedia.org/wiki/Namer#/media/File:Flickr_-_Israel_Defense_Forces_-_13th_Battalion_of_the_Golani_Brigade_Holds_Drill_at_Golan_Heights_(8).jpg
                { name: "M109 Doher", count: 600, type: "Self-Propelled Howitzer", description: "Israeli-modified M109 with improved fire control and autonomous operation", image: "Israel_details/Israel_army_details/m109_doher.png" } // src: https://upload.wikimedia.org/wikipedia/commons/b/b9/Israeli_Doher_M109_Deployed.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
            ]
        },
        navy: {
            carriers: 0, submarines: 5, destroyers: 0, frigates: 0,
            name: "Israeli Navy",
            founded: "March 17, 1948",
            motto: "Onward to the Sea",
            description: "The Israeli Navy operates Dolphin-class submarines believed to be nuclear-capable, and Sa'ar 6 corvettes with Iron Dome missile defense. It focuses on coastal defense and submarine deterrence.",
            image: "Israel_details/israel_navy_flag.jpg",
            equipment: [
                { name: "Dolphin-class Submarine", count: 5, type: "Attack Submarine", description: "German-built diesel-electric submarine widely believed to carry nuclear-capable cruise missiles", image: "Israel_details/Israel_navy_details/dolphin_class_submarine.png" }, // src: https://en.wikipedia.org/wiki/Dolphin-class_submarine#/media/File:RAHAV_7213.JPG
                { name: "Sa'ar 6 Corvette", count: 4, type: "Guided Missile Corvette", description: "German-designed corvette with C-Dome (naval Iron Dome) air defense system", image: "Israel_details/Israel_navy_details/sa_ar_6_corvette.png" }, // src: https://en.wikipedia.org/wiki/Sa%27ar_6-class_corvette#/media/File:Sa'ar-6-class-corvette-0026.jpg
                { name: "Sa'ar 5 Corvette", count: 3, type: "Guided Missile Corvette", description: "Stealth corvette with Barak-8 SAM and anti-ship missile capability", image: "Israel_details/Israel_navy_details/sa_ar_5_corvette.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/c/cf/Israeli_Sa%27ar_5-class_corvette_underway_in_the_Gulf_of_Aqaba_on_15_February_2022_%28220215-A-AI379-757%29.JPG?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Shaldag MkV Patrol", count: 12, type: "Fast Patrol Craft", description: "High-speed patrol boat for coastal defense and special operations insertion", image: "Israel_details/Israel_navy_details/shaldag_mkv_patrol.png" } // src: https://en.wikipedia.org/wiki/Shaldag-class_patrol_boat#/media/File:ShaldagMK5.jpg
            ]
        },
        airforce: {
            fighters: 241, bombers: 0, transport: 60, helicopters: 127,
            name: "Israeli Air Force",
            founded: "May 28, 1948",
            motto: "The Best to Flight",
            description: "The Israeli Air Force is one of the most experienced and capable in the world. It operates the unique F-35I Adir with Israeli modifications and has extensive combat experience in precision strikes.",
            image: "Israel_details/israel_airforce_flag.jpg",
            equipment: [
                { name: "F-35I Adir", count: 50, type: "5th Gen Stealth Fighter", description: "Israeli-modified F-35A with indigenous EW, sensors, and weapons integration", image: "Israel_details/Israel_airforce_details/f35i_adir.png" }, // src: https://en.wikipedia.org/wiki/Lockheed_Martin_F-35_Lightning_II_Israeli_procurement#/media/File:IAF-F-35I-2016-12-13_(cropped).jpg
                { name: "F-15I Ra'am", count: 25, type: "Strike Fighter", description: "Long-range strike variant of F-15E with conformal fuel tanks and Israeli avionics", image: "Israel_details/Israel_airforce_details/f15i_ra_am.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/0/03/F-15I%286%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "F-16I Sufa", count: 100, type: "Multirole Fighter", description: "Israeli Block 52+ F-16 with conformal fuel tanks and dorsal spine for avionics", image: "Israel_details/Israel_airforce_details/f16i_sufa.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/d/d0/IAF-F-16I-2016-12-13.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "AH-64D Apache", count: 48, type: "Attack Helicopter", description: "Saraf variant with Israeli modifications and combat-proven in multiple conflicts", image: "Israel_details/Israel_airforce_details/ah_64d_apache.png" } // src: https://upload.wikimedia.org/wikipedia/commons/b/bc/IAF_AH-64D_Apache_with_Spike_NLOS%2C_2021.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
            ]
        }
    },
    "Egypt": {
        name: "Egypt",
        flag: "🇪🇬",
        countryCode: "eg",
        rank: 15,
        budget: "$4.6B",
        nuclear: { status: false },
        personnel: { active: 438500, reserve: 479000 },
        description: "The Egyptian Armed Forces are the largest military in Africa and the Arab world. Egypt operates a diverse fleet from both Western and Russian sources, including M1 Abrams tanks, Rafale fighters, and Mistral helicopter carriers.",
        image: "Egypt_details/egypt_flag.jpg",
        army: {
            tanks: 4295, apc: 11000, artillery: 1665, mlrs: 1100,
            name: "Egyptian Army",
            founded: "1820",
            motto: "Victory or Martyrdom",
            description: "The Egyptian Army is the largest in the Middle East with a massive tank fleet combining American Abrams, Russian T-90S, and thousands of older M60 Pattons.",
            image: "Egypt_details/egypt_army_flag.jpg",
            equipment: [
                { name: "M1A1 Abrams", count: 1130, type: "Main Battle Tank", description: "US-built MBT co-produced in Egypt, backbone of Egyptian armored forces", image: "Egypt_details/Egypt_army_details/m1a1_abrams.png" }, // src: https://en.wikipedia.org/wiki/M1_Abrams#/media/File:M1A1_Twin_Bridges_training_area_2C_Republic_of_Korea_1-23_Infantry.jpg
                { name: "T-90S", count: 500, type: "Main Battle Tank", description: "Russian MBT acquired to diversify tank fleet with Kontakt-5 ERA armor", image: "Egypt_details/Egypt_army_details/t90_s.png" }, // src: https://en.wikipedia.org/wiki/T-90#/media/File:T-90S_tank.jpg
                { name: "M60 Patton", count: 1700, type: "Main Battle Tank", description: "Aging but numerous US-origin tank making up the bulk of reserve formations", image: "Egypt_details/Egypt_army_details/m60_patton.png" }, // src: https://en.wikipedia.org/wiki/M60_tank#/media/File:DM-SC-92-03658.jpg
                { name: "M109 SPH", count: 200, type: "Self-Propelled Howitzer", description: "155mm self-propelled artillery providing fire support for armored divisions", image: "Egypt_details/Egypt_army_details/m109_sph.png" } // src: https://upload.wikimedia.org/wikipedia/commons/a/ab/Egyptian_M109_during_Operation_Bright_Star_2005.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
            ]
        },
        navy: {
            carriers: 2, submarines: 8, destroyers: 0, frigates: 9,
            name: "Egyptian Navy",
            founded: "1820",
            motto: "Defend the Seas of Egypt",
            description: "The Egyptian Navy is the largest in the Middle East and Africa, operating two Mistral-class helicopter carriers purchased from France and a mixed fleet of submarines and frigates.",
            image: "Egypt_details/egypt_navy_flag.jpg",
            equipment: [
                { name: "Mistral-class LHD", count: 2, type: "Helicopter Carrier", description: "French-built 21,000-ton amphibious assault ship with 16 helicopters", image: "Egypt_details/Egypt_navy_details/mistral_class_lhd.png" }, // src: https://en.wikipedia.org/wiki/Mistral-class_landing_helicopter_dock#/media/File:BPC_Dixmude.jpg
                { name: "Type 209 Submarine", count: 4, type: "Attack Submarine", description: "German-designed diesel-electric submarine for Mediterranean operations", image: "Egypt_details/Egypt_navy_details/type_209_submarine.png" }, // src: https://en.wikipedia.org/wiki/Type_209_submarine#/media/File:S44_Egyptian_submarine_of_German_submarine_class_209-1400mod_at_Kiel.jpg/2
                { name: "Type 033 Submarine", count: 4, type: "Coastal Submarine", description: "Chinese-origin diesel-electric submarine for coastal defense", image: "Egypt_details/Egypt_navy_details/type_033_submarine.png" }, // src: https://en.wikipedia.org/wiki/Romeo-class_submarine#/media/File:%E6%BD%9C%E8%89%87.JPG
                { name: "FREMM Frigate", count: 2, type: "Multipurpose Frigate", description: "Franco-Italian frigate with Aster missiles for area air defense", image: "Egypt_details/Egypt_navy_details/fremm_frigate.png" } // src: https://en.wikipedia.org/wiki/FREMM_multipurpose_frigate#/media/File:Carabiniere_(F593),_Fremantle,_2017_(03).jpg
            ]
        },
        airforce: {
            fighters: 337, bombers: 0, transport: 82, helicopters: 280,
            name: "Egyptian Air Force",
            founded: "1930",
            motto: "Higher and Higher for the Sake of Glory",
            description: "The Egyptian Air Force operates a diverse fleet from multiple sources — American F-16s, French Rafales, and Russian MiG-29s — giving it the largest fighter force in Africa.",
            image: "Egypt_details/egypt_airforce_flag.jpg",
            equipment: [
                { name: "F-16C/D", count: 220, type: "Multirole Fighter", description: "Block 40/52 variants forming the backbone of Egyptian airpower", image: "Egypt_details/Egypt_airforce_details/f16_c_d.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/1/10/An_F-16_of_the_Egyptian_Air_Force_fly_in_support_of_exercise_Agile_Phoenix.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Rafale", count: 54, type: "Omnirole Fighter", description: "French twin-engine fighter providing advanced air superiority capability", image: "Egypt_details/Egypt_airforce_details/rafale.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/b/bc/9265_Rafale_DM_Egyptian_Air_Force_El_Alamein_5.9.24_%2854025821284%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "MiG-29", count: 46, type: "Air Superiority Fighter", description: "Russian 4th-gen twin-engine interceptor diversifying Egypt's fighter fleet", image: "Egypt_details/Egypt_airforce_details/mig_29.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/c/c9/8728_Mig-29M_Egyptian_Air_Force_El_Alamein_4.9.24_%2854020815542%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "AH-64D Apache", count: 46, type: "Attack Helicopter", description: "Twin-engine attack helicopter with Hellfire missiles for anti-armor operations", image: "Egypt_details/Egypt_airforce_details/ah_64d_apache.png" } // src: https://en.wikipedia.org/wiki/Boeing_AH-64_Apache#/media/File:AH-64D_Apache_Longbow.jpg
            ]
        }
    },
    "Pakistan": {
        name: "Pakistan",
        flag: "🇵🇰",
        countryCode: "pk",
        rank: 9,
        budget: "$10.3B",
        nuclear: { status: true, warheads: 170, type: "Confirmed", firstTest: "May 28, 1998 (Chagai-I)" },
        personnel: { active: 654000, reserve: 550000, paramilitary: 420000 },
        description: "Pakistan's nuclear weapons program began in the 1970s under Prime Minister Zulfikar Ali Bhutto after India's first nuclear test (Smiling Buddha, 1974). China played a crucial role in Pakistan's nuclear development — providing a tested nuclear weapon design (believed to be the CHIC-4 compact fission design), highly enriched uranium, and assistance in building the Khushab plutonium production reactor. Additionally, Dr. Abdul Qadeer Khan brought uranium centrifuge enrichment technology from the Netherlands (URENCO) and established the Kahuta Research Laboratories. China also transferred M-11 ballistic missile technology, forming the basis of Pakistan's delivery systems. Pakistan conducted its first nuclear tests on May 28, 1998 (Chagai-I — 5 simultaneous detonations) and May 30, 1998 (Chagai-II), in direct response to India's Pokhran-II tests. Pakistan now possesses an estimated 170 nuclear warheads — the fastest-growing arsenal in the world — deliverable by Shaheen ballistic missiles, Ra'ad air-launched cruise missiles, and Babur-3 submarine-launched cruise missiles.",
        image: "Pakistan_details/pakistan_flag.jpg",
        army: {
            tanks: 3742, apc: 8500, artillery: 4472, mlrs: 560,
            name: "Pakistan Army",
            founded: "August 14, 1947",
            motto: "Faith, Piety, Jihad in the path of Allah",
            strength: "560,000 active",
            image: "Pakistan_details/pakistan_army_flag.jpg",
            equipment: [
                { name: "Al-Khalid MBT", count: 600, type: "Main Battle Tank", description: "Jointly developed with China, featuring 125mm smoothbore gun and composite armor", image: "Pakistan_details/Pakistan_army_details/al_khalid_mbt.png" }, // src: https://en.wikipedia.org/wiki/Al-Khalid_tank#/media/File:Al-Khalid_IDEAS_2012.jpg
                { name: "T-80UD", count: 320, type: "Main Battle Tank", description: "Ukrainian-built gas turbine tank with strong armor protection", image: "Pakistan_details/Pakistan_army_details/t80_ud.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/c/c6/Verkhnyaya_Pyshma_Tank_Museum_2012_0078.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Type 85-IIAP", count: 300, type: "Main Battle Tank", description: "Chinese-origin MBT with 125mm gun", image: "Pakistan_details/Pakistan_army_details/type_85_iiap.png" }, // src: https://en.wikipedia.org/wiki/Type_80/88_main_battle_tank#/media/File:Chinese_Type_80-%D0%86%D0%86_Tank.jpg
                { name: "M113 APC", count: 1800, type: "Armored Personnel Carrier", description: "Widely used tracked APC for infantry transport", image: "Pakistan_details/Pakistan_army_details/m113_apc.png" } // src: https://en.wikipedia.org/wiki/M113_armored_personnel_carrier#/media/File:M113_of_UA_marines_01.jpg
            ]
        },
        navy: {
            carriers: 0, submarines: 8, destroyers: 0, frigates: 10,
            name: "Pakistan Navy",
            founded: "August 14, 1947",
            motto: "Power Through the Seas",
            strength: "30,000 active",
            image: "Pakistan_details/pakistan_navy_flag.jpg",
            equipment: [
                { name: "Agosta 90B Submarine", count: 3, type: "Attack Submarine", description: "French-designed AIP-equipped diesel submarine with SM39 Exocet capability", image: "Pakistan_details/Pakistan_navy_details/agosta_90b_submarine.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/9/99/Hamza%21.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Type 054A/P Frigate", count: 4, type: "Guided Missile Frigate", description: "Chinese-built modern frigate with HQ-16 SAM and anti-ship missiles", image: "Pakistan_details/Pakistan_navy_details/type_054a_p_frigate.png" }, // src: https://en.wikipedia.org/wiki/Tughril-class_frigate#/media/File:PNS_Shah_Jahan_(F264).jpg
                { name: "Hangor-class Submarine", count: 8, type: "Attack Submarine", description: "Chinese Yuan-class submarine with AIP technology (on order)", image: "Pakistan_details/Pakistan_navy_details/hangor_class_submarine.png" }, // src: AI - Generated image
                { name: "PNS Alamgir (F-260)", count: 1, type: "Frigate", description: "Ex-US Oliver Hazard Perry-class guided missile frigate", image: "Pakistan_details/Pakistan_navy_details/pns_alamgir.png" } // src: https://en.wikipedia.org/wiki/USS_McInerney#/media/File:USS_McInerney_(FFG-8)_underway_in_the_Atlantic_Ocean_on_8_June_2004.jpg
            ]
        },
        airforce: {
            fighters: 570, bombers: 0, transport: 228, helicopters: 380,
            name: "Pakistan Air Force",
            founded: "August 14, 1947",
            motto: "In God We Soar with Strength",
            strength: "70,000 active",
            image: "Pakistan_details/pakistan_airforce_flag.jpg",
            equipment: [
                { name: "JF-17 Thunder", count: 150, type: "Multirole Fighter", description: "Jointly developed with China, lightweight single-engine multi-role combat aircraft", image: "Pakistan_details/Pakistan_airforce_details/jf17_thunder.png" }, // src: https://en.wikipedia.org/wiki/CAC/PAC_JF-17_Thunder#/media/File:Pakistan_Air_Force_Chengdu_JF-17_Gu.jpg
                { name: "F-16 Fighting Falcon", count: 85, type: "Multirole Fighter", description: "US-built 4th gen fighter, backbone of PAF air superiority", image: "Pakistan_details/Pakistan_airforce_details/f16_fighting_falcon.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/3/38/Pakistan_Air_Force_General_Dynamics_F-16BM_Fighting_Falcon_%28altered%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "J-10CE", count: 36, type: "Multirole Fighter", description: "Chinese 4.5-gen single-engine fighter with AESA radar", image: "Pakistan_details/Pakistan_airforce_details/j10_ce.png" }, // src: https://en.wikipedia.org/wiki/Chengdu_J-10#/media/File:%D0%97%D0%B0%D1%87%D0%B5%D1%82%D0%BD%D1%8B%D0%B5_%D0%BF%D0%BE%D0%BB%D0%B5%D1%82%D1%8B_%D1%83%D1%87%D0%B0%D1%81%D1%82%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2_%D0%BA%D0%BE%D0%BD%D0%BA%D1%83%D1%80%D1%81%D0%B0_%C2%AB%D0%90%D0%B2%D0%B8%D0%B0%D0%B4%D0%B0%D1%80%D1%82%D1%81%C2%BB_(%D0%BF._%D0%A7%D0%B0%D0%BD%D1%87%D1%83%D0%BD%D1%8C,_%D0%9A%D0%9D%D0%A0)_(5).jpg
                { name: "Mirage III/V", count: 120, type: "Strike Fighter", description: "French-built delta wing fighter used for strike missions", image: "Pakistan_details/Pakistan_airforce_details/mirage_iii_v.png" } // src: https://en.wikipedia.org/wiki/Dassault_Mirage_III#/media/File:PAF_Dassault_Mirage_reconnaissance_variant_with_F-16C_Block_52+.jpg
            ]
        }
    },
    "Iran": {
        name: "Iran",
        flag: "🇮🇷",
        countryCode: "ir",
        rank: 14,
        budget: "$24.6B",
        nuclear: { status: false, warheads: 0, type: "Suspected Program" },
        personnel: { active: 610000, reserve: 350000, paramilitary: 220000 },
        description: "Iran wields significant asymmetric military capabilities through its ballistic missile arsenal and IRGC proxy network across the Middle East. Its drone technology has proven effective in multiple conflicts.",
        image: "Iran_details/iran_flag.jpg",
        army: {
            tanks: 1513, apc: 2500, artillery: 3668, mlrs: 1474,
            name: "Islamic Republic of Iran Army",
            founded: "April 18, 1925",
            motto: "For Allah, the Country, the Leader",
            strength: "420,000 active",
            image: "Iran_details/iran_army_flag.jpg",
            equipment: [
                { name: "Karrar MBT", count: 100, type: "Main Battle Tank", description: "Domestically produced tank based on T-72 with advanced electronics and ERA", image: "Iran_details/Iran_army_details/karrar_mbt.png" }, // src: https://en.wikipedia.org/wiki/Karrar_(tank)#/media/File:18-Karar_tank_-%D8%AA%D8%A7%D9%86%DA%A9_%DA%A9%D8%B1%D8%A7%D8%B1.jpg
                { name: "T-72S", count: 480, type: "Main Battle Tank", description: "Russian-built main battle tank, backbone of Iranian armored forces", image: "Iran_details/Iran_army_details/t72_s.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/a/a3/Islamic_Republic_of_Iran_Army_Day%2C_2014_%28261%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Zulfiqar MBT", count: 150, type: "Main Battle Tank", description: "Indigenous MBT with 125mm smoothbore gun", image: "Iran_details/Iran_army_details/zulfiqar_mbt.png" }, // src: https://en.wikipedia.org/wiki/Zulfiqar_(tank)#/media/File:Sacred_Defence_Week_parade,_2012,_in_Tehran_(107).jpg
                { name: "BMP-2", count: 400, type: "Infantry Fighting Vehicle", description: "Soviet-origin IFV with 30mm autocannon", image: "Iran_details/Iran_army_details/bmp_2.png" } // src: https://upload.wikimedia.org/wikipedia/commons/e/e2/Islamic_Republic_of_Iran_Army_Day%2C_2019_%28153%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
            ]
        },
        navy: {
            carriers: 0, submarines: 19, destroyers: 0, frigates: 7,
            name: "Islamic Republic of Iran Navy",
            founded: "November 28, 1923",
            motto: "Power and Authority Over the Waters",
            strength: "28,000 active",
            image: "Iran_details/iran_navy_flag.jpg",
            equipment: [
                { name: "Kilo-class Submarine", count: 3, type: "Attack Submarine", description: "Russian-built diesel-electric submarine with torpedo and mine capability", image: "Iran_details/Iran_navy_details/kilo_class_submarine.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/3/30/Iranian_Kilo-class_submarine_4.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Ghadir-class Mini-Sub", count: 14, type: "Midget Submarine", description: "Domestically built coastal defense submarine", image: "Iran_details/Iran_navy_details/ghadir_class_mini_sub.png" }, // src: https://en.wikipedia.org/wiki/Ghadir-class_submarine#/media/File:Velayat_94_Military_exercise_27_by_Mbazri.jpg
                { name: "Moudge-class Frigate", count: 3, type: "Frigate", description: "Indigenous light frigate with anti-ship and SAM missiles", image: "Iran_details/Iran_navy_details/moudge_class_frigate.png" }, // src: https://en.wikipedia.org/wiki/Moudge-class_frigate#/media/File:%D9%86%D8%A7%D9%88%D8%B4%DA%A9%D9%86_%D8%AF%DB%8C%D9%84%D9%85%D8%A7%D9%86.jpg/2
                { name: "Shahid Mahdavi Destroyer", count: 1, type: "Destroyer", description: "New domestically built heavy warship", image: "Iran_details/Iran_navy_details/shahid_mahdavi_destroyer.png" } // src: https://en.wikipedia.org/wiki/IRIS_Shahid_Mahdavi#/media/File:Commissioning_ceremony_of_IRGC_naval_vessels_in_March_2023_(06).jpg
            ]
        },
        airforce: {
            fighters: 345, bombers: 0, transport: 130, helicopters: 334,
            name: "Islamic Republic of Iran Air Force",
            founded: "1924",
            motto: "Guardians of the Skies",
            strength: "52,000 active",
            image: "Iran_details/iran_airforce_flag.jpg",
            equipment: [
                { name: "F-14 Tomcat", count: 40, type: "Interceptor", description: "US-built twin-engine interceptor with AWG-9 radar, modernized with domestic avionics", image: "Iran_details/Iran_airforce_details/f14_tomcat.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/f/fa/Iranian_AF_F-14_Tomcat_landing_at_Mehrabad.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Kowsar Fighter", count: 15, type: "Multirole Fighter", description: "Domestically produced 4th-gen fighter based on F/A-18 design", image: "Iran_details/Iran_airforce_details/kowsar_fighter.png" }, // src: https://en.wikipedia.org/wiki/HESA_Kowsar#/media/File:HESA_Kowsar4.jpg
                { name: "MiG-29", count: 36, type: "Air Superiority Fighter", description: "Russian-built twin-engine air superiority fighter", image: "Iran_details/Iran_airforce_details/mig_29.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/f/f6/Iranian_air_force_preparing_for_annual_parade_in_2019_%2819%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Shahed-136 Drone", count: 1000, type: "Loitering Munition", description: "Cheap kamikaze drone used extensively in regional conflicts", image: "Iran_details/Iran_airforce_details/shahed_136_drone.png" } // src: https://en.wikipedia.org/wiki/HESA_Shahed_136#/media/File:2023_IRGC_Aerospace_Force_achievements_Exhibition_in_Kermanshah_(018).jpg
            ]
        }
    },
    "SaudiArabia": {
        name: "Saudi Arabia",
        flag: "🇸🇦",
        countryCode: "sa",
        rank: 22,
        budget: "$75.8B",
        nuclear: { status: false, warheads: 0, type: "No Program" },
        personnel: { active: 257000, reserve: 25000, paramilitary: 100000 },
        description: "Saudi Arabia possesses one of the world's best-funded militaries with cutting-edge Western equipment. It operates advanced US and European fighter jets, tanks, and air defense systems.",
        image: "SaudiArabia_details/saudiarabia_flag.jpg",
        army: {
            tanks: 1062, apc: 5500, artillery: 680, mlrs: 322,
            name: "Royal Saudi Land Forces",
            founded: "1934",
            motto: "There is no god but God",
            strength: "160,000 active",
            image: "SaudiArabia_details/saudiarabia_army_flag.jpg",
            equipment: [
                { name: "M1A2S Abrams", count: 373, type: "Main Battle Tank", description: "Saudi variant of the M1A2 with improved armor package", image: "SaudiArabia_details/SaudiArabia_army_details/m1a2s_abrams.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/0/0b/M1A2_Abrams_crews_train_on_the_move_in_Kuwait_DVIDS661052.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "AMX-30", count: 300, type: "Main Battle Tank", description: "French-built MBT being phased out", image: "SaudiArabia_details/SaudiArabia_army_details/amx_30.png" }, // src: https://commons.wikimedia.org/wiki/File:French_AMX-30_Desert_Storm.jpg
                { name: "LAV-25", count: 1117, type: "Armored Fighting Vehicle", description: "Eight-wheeled light armored vehicle for reconnaissance", image: "SaudiArabia_details/SaudiArabia_army_details/lav_25.png" }, // src: https://en.wikipedia.org/wiki/LAV-25#/media/File:LAV-25A2.jpg
                { name: "M2 Bradley", count: 400, type: "Infantry Fighting Vehicle", description: "US-built IFV for mechanized infantry", image: "SaudiArabia_details/SaudiArabia_army_details/m2_bradley.png" } // src: https://en.wikipedia.org/wiki/M2_Bradley#/media/File:US_M2A1_Bradley_deployed_to_Saudi_Arabia_during_Operation_Desert_Shield.jpg
            ]
        },
        navy: {
            carriers: 0, submarines: 0, destroyers: 0, frigates: 7,
            name: "Royal Saudi Naval Forces",
            founded: "1960",
            motto: "Guardians of the Seas",
            strength: "15,000 active",
            image: "SaudiArabia_details/saudiarabia_navy_flag.jpg",
            equipment: [
                { name: "Al-Riyadh Frigate", count: 3, type: "Guided Missile Frigate", description: "French La Fayette-class with Aster 15 SAM and Exocet missiles", image: "SaudiArabia_details/SaudiArabia_navy_details/al_riyadh_frigate.png" }, // src: https://en.wikipedia.org/wiki/La_Fayette-class_frigate#/media/File:FS_Surcouf.jpg
                { name: "Al-Madinah Frigate", count: 4, type: "Frigate", description: "French F-2000 type with Otomat anti-ship missiles", image: "SaudiArabia_details/SaudiArabia_navy_details/al_madinah_frigate.png" }, // src: https://en.wikipedia.org/wiki/Al_Madinah-class_frigate#/media/File:Royal_Saudi_Navy_Al_Madinah-class_Frigate_2(1).jpg
                { name: "Al-Siddiq Fast attack craft", count: 9, type: "Missile Corvette", description: "US-built patrol corvettes with Harpoon anti-ship missiles", image: "SaudiArabia_details/SaudiArabia_navy_details/al_siddiq_fast_attack_craft.png" }, // src: https://en.wikipedia.org/wiki/Al-Siddiq-class_corvette
                { name: "Avante 2200 Corvette", count: 5, type: "Corvette", description: "Spanish-built modern multi-mission corvettes (on order)", image: "SaudiArabia_details/SaudiArabia_navy_details/avante_2200_corvette.png" } // src: https://en.wikipedia.org/wiki/Avante_2200#/media/File:PC-21_Guaiqueri_14_de_Mayo_2011_Foto_Capit%C3%A1n_Ted.jpg
            ]
        },
        airforce: {
            fighters: 348, bombers: 0, transport: 150, helicopters: 245,
            name: "Royal Saudi Air Force",
            founded: "1950",
            motto: "Soaring to Protect",
            strength: "45,000 active",
            image: "SaudiArabia_details/saudiarabia_airforce_flag.jpg",
            equipment: [
                { name: "F-15SA Strike Eagle", count: 84, type: "Air Superiority Fighter", description: "Advanced variant of F-15 with fly-by-wire flight controls and AESA radar", image: "SaudiArabia_details/SaudiArabia_airforce_details/f15sa_strike_eagle.png" }, // src: https://en.wikipedia.org/wiki/McDonnell_Douglas_F-15E_Strike_Eagle#/media/File:McDonnell_Douglas_F-15E_First_production_F-15E_(SN_86-0183)_in_flight_060905-F-1234S-026.jpg
                { name: "F-15S Eagle", count: 70, type: "Strike Fighter", description: "Saudi variant of the F-15E for air-to-ground missions", image: "SaudiArabia_details/SaudiArabia_airforce_details/f15s_eagle.png" }, // src: https://en.wikipedia.org/wiki/McDonnell_Douglas_F-15E_Strike_Eagle#/media/File:McDonnell_Douglas_F-15E_First_production_F-15E_(SN_86-0183)_in_flight_060905-F-1234S-026.jpg
                { name: "Eurofighter Typhoon", count: 72, type: "Multirole Fighter", description: "European twin-engine 4.5-gen multi-role fighter", image: "SaudiArabia_details/SaudiArabia_airforce_details/eurofighter_typhoon.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/2/2a/Saudi_eurofighter.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Tornado IDS", count: 80, type: "Strike Aircraft", description: "European variable-sweep wing strike aircraft", image: "SaudiArabia_details/SaudiArabia_airforce_details/tornado_ids.png" } // src: https://upload.wikimedia.org/wikipedia/commons/2/26/Panavia_Tornado_IDS_-_Royal_Saudi_Air_Force_-_8306_%2849596125828%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
            ]
        }
    },
    "Brazil": {
        name: "Brazil",
        flag: "🇧🇷",
        countryCode: "br",
        rank: 12,
        budget: "$22.2B",
        nuclear: { status: false, warheads: 0, type: "No Program" },
        personnel: { active: 360000, reserve: 1340000, paramilitary: 395000 },
        description: "Brazil is the dominant military power in Latin America with the largest armed forces in the region. It operates a carrier and maintains a nuclear submarine program.",
        image: "Brazil_details/brazil_flag.jpg",
        army: {
            tanks: 437, apc: 2400, artillery: 756, mlrs: 70,
            name: "Brazilian Army",
            founded: "April 19, 1648",
            motto: "Arm Strong, Friendly Hand",
            strength: "223,000 active",
            image: "Brazil_details/brazil_army_flag.png",
            equipment: [
                { name: "Leopard 1A5 BR", count: 220, type: "Main Battle Tank", description: "Modernized German MBT with thermal imaging and fire control", image: "Brazil_details/Brazil_army_details/leopard_1a5_br.png" }, // src: https://en.wikipedia.org/wiki/Leopard_1#/media/File:19_04_2022_-_Ministro_da_Defesa_prestigia_celebra%C3%A7%C3%A3o_dos_374_anos_do_Ex%C3%A9rcito_(52017823580).jpg
                { name: "M60A3 TTS", count: 91, type: "Main Battle Tank", description: "American MBT with thermal targeting system", image: "Brazil_details/Brazil_army_details/m60a3_tts.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/9/9d/M60A3TTSBRASIL.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "VBTP-MR Guarani", count: 400, type: "Armored Personnel Carrier", description: "Modern 6x6 armored vehicle designed and built in Brazil", image: "Brazil_details/Brazil_army_details/vbtp_mr_guarani.png" }, // src: https://en.wikipedia.org/wiki/VBTP-MR_Guarani#/media/File:19_04_2022-_Dia_do_Ex%C3%A9rcito_Brasileiro_(52016606453).jpg
                { name: "ASTROS II", count: 70, type: "MLRS", description: "Brazilian-made multi-caliber rocket launcher system", image: "Brazil_details/Brazil_army_details/astros_ii.png" } // src: https://en.wikipedia.org/wiki/Astros_II#/media/File:Opera%C3%A7%C3%A3o_Formosa_2014_(15481886779).jpg
            ]
        },
        navy: {
            carriers: 1, submarines: 5, destroyers: 0, frigates: 9,
            name: "Brazilian Navy",
            founded: "December 10, 1822",
            motto: "Homeland and Honor",
            strength: "80,000 active",
            image: "Brazil_details/brazil_navy_flag.jpg",
            equipment: [
                { name: "NAM Atlântico", count: 1, type: "Helicopter Carrier", description: "Multi-purpose amphibious assault ship (ex-HMS Ocean)", image: "Brazil_details/Brazil_navy_details/nam_atlantico.png" }, // src: https://en.wikipedia.org/wiki/Brazilian_helicopter_carrier_Atl%C3%A2ntico#/media/File:Opera%C3%A7%C3%A3o_%22Poseidon_2021%22_(51475998419).jpg
                { name: "Scorpène-class Submarine", count: 4, type: "Attack Submarine", description: "French-designed diesel-electric submarine built in Brazil", image: "Brazil_details/Brazil_navy_details/scorpene_class_submarine.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/d/d4/Scorpene_Tunku_Abdul_Rahman.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Álvaro Alberto SSBN", count: 1, type: "Nuclear Submarine", description: "Under construction — Brazil's first nuclear-powered submarine", image: "Brazil_details/Brazil_navy_details/alvaro_alberto_ssbn.png" }, // src: AI - Generated image
                { name: "Tamandaré-class Corvette", count: 4, type: "Corvette", description: "German-designed modern multi-mission corvettes (under construction)", image: "Brazil_details/Brazil_navy_details/tamandare_class_corvette.png" } // src: https://en.wikipedia.org/wiki/Tamandar%C3%A9-class_frigate#/media/File:Fragata_%E2%80%9CTamandar%C3%A9%E2%80%9D_chega_pela_primeira_vez_ao_Rio_de_Janeiro_(55336643549)_(cropped).jpg
            ]
        },
        airforce: {
            fighters: 210, bombers: 0, transport: 362, helicopters: 122,
            name: "Brazilian Air Force",
            founded: "January 20, 1941",
            motto: "Wings That Protect the Country",
            strength: "70,000 active",
            image: "Brazil_details/brazil_airforce_flag.jpg",
            equipment: [
                { name: "Gripen E/F", count: 36, type: "Multirole Fighter", description: "Swedish 4.5-gen fighter with AESA radar and supercruise capability", image: "Brazil_details/Brazil_airforce_details/gripen_e_f.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/4/4b/FAB_Gripen_F-39E_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "AMX A-1", count: 43, type: "Ground Attack Aircraft", description: "Italian-Brazilian subsonic attack aircraft", image: "Brazil_details/Brazil_airforce_details/amx_a_1.png" }, // src: https://en.wikipedia.org/wiki/AMX_International_AMX#/media/File:FAB_AMX_International_A-1A_-_Lofting.jpg
                { name: "A-29 Super Tucano", count: 99, type: "Light Attack/Trainer", description: "Brazilian-built turboprop counter-insurgency and training aircraft", image: "Brazil_details/Brazil_airforce_details/a29_super_tucano.png" }, // src: https://en.wikipedia.org/wiki/Embraer_EMB_314_Super_Tucano#/media/File:Embraer_EMB-314_Super_Tucano_Brazilian_Air_Force_1.jpg
                { name: "KC-390 Millennium", count: 6, type: "Transport Aircraft", description: "Brazilian-designed twin-jet military transport — most advanced in its class", image: "Brazil_details/Brazil_airforce_details/kc_390_millennium.png" } // src: https://en.wikipedia.org/wiki/Embraer_C-390_Millennium#/media/File:Apresenta%C3%A7%C3%A3o_KC-390_(15576572716).jpg
            ]
        }
    },
    "Indonesia": {
        name: "Indonesia",
        flag: "🇮🇩",
        countryCode: "id",
        rank: 16,
        budget: "$9.4B",
        nuclear: { status: false, warheads: 0, type: "No Program" },
        personnel: { active: 395000, reserve: 400000, paramilitary: 280000 },
        description: "Indonesia commands the largest military in Southeast Asia, strategically positioned across thousands of islands controlling vital sea lanes including the Strait of Malacca.",
        image: "Indonesia_details/indonesia_flag.jpg",
        army: {
            tanks: 396, apc: 1089, artillery: 283, mlrs: 36,
            name: "Indonesian Army (TNI-AD)",
            founded: "October 5, 1945",
            motto: "Kartika Eka Paksi (Unrivaled Single Bird)",
            strength: "300,000 active",
            image: "Indonesia_details/indonesia_army_flag.png",
            equipment: [
                { name: "Leopard 2A4", count: 61, type: "Main Battle Tank", description: "German-built 3rd gen MBT for heavy armored operations", image: "Indonesia_details/Indonesia_army_details/leopard_2a4.png" }, // src: https://en.wikipedia.org/wiki/Leopard_2#/media/File:Leopard_2A4_Austria_6.JPG
                { name: "Leopard 2 Revolution", count: 42, type: "Main Battle Tank", description: "Upgraded Leopard 2 with enhanced urban warfare protection", image: "Indonesia_details/Indonesia_army_details/leopard_2_revolution.png" }, // src: AI - Generated image
                { name: "Marder 1A3 IFV", count: 50, type: "Infantry Fighting Vehicle", description: "German IFV with 20mm autocannon", image: "Indonesia_details/Indonesia_army_details/marder_1a3_ifv.png" }, // src: https://en.wikipedia.org/wiki/Marder_(infantry_fighting_vehicle)#/media/File:Marder1A3.6.jpg
                { name: "Anoa 6x6 APC", count: 150, type: "Armored Personnel Carrier", description: "Domestically built Indonesian armored vehicle", image: "Indonesia_details/Indonesia_army_details/anoa_6x6_apc.png" } // src: https://en.wikipedia.org/wiki/Anoa_(armoured_personnel_carrier)#/media/File:Demo_kendaraan_tempur_Anoa_3_pada_27_Januari_2023.jpg
            ]
        },
        navy: {
            carriers: 0, submarines: 5, destroyers: 0, frigates: 8,
            name: "Indonesian Navy (TNI-AL)",
            founded: "September 10, 1945",
            motto: "Jalesveva Jayamahe (At Sea We Triumph)",
            strength: "65,000 active",
            image: "Indonesia_details/indonesia_navy_flag.png",
            equipment: [
                { name: "Type 209/1400 Submarine", count: 2, type: "Attack Submarine", description: "German-built diesel-electric submarine for patrol operations", image: "Indonesia_details/Indonesia_navy_details/type_209_1400_submarine.png" }, // src: https://en.wikipedia.org/wiki/Nagapasa-class_submarine#/media/File:Submarine_KRI_Nagapasa,_Indonesian_Navy.jpg
                { name: "Scorpène-class Submarine", count: 2, type: "Attack Submarine", description: "French-designed submarine (on order)", image: "Indonesia_details/Indonesia_navy_details/scorpene_class_submarine.png" }, // src: https://en.wikipedia.org/wiki/Scorp%C3%A8ne-class_submarine#/media/File:INS_Kalvari_(S21)_at_sea.jpg
                { name: "SIGMA-class Frigate", count: 2, type: "Guided Missile Frigate", description: "Dutch-built modern frigate with Exocet missiles", image: "Indonesia_details/Indonesia_navy_details/sigma_class_frigate.png" }, // src: https://en.wikipedia.org/wiki/Sigma-class_design#/media/File:Kri-diponegoro-1600-1200.jpg
                { name: "Ahmad Yani-class Frigate", count: 6, type: "Frigate", description: "Ex-Dutch Van Speijk-class refurbished frigates", image: "Indonesia_details/Indonesia_navy_details/ahmad_yani_class_frigate.png" } // src: https://en.wikipedia.org/wiki/Ahmad_Yani-class_frigate#/media/File:Presidential_Inspection_empat_Fregat_kelas_Ahmad_Yani,_2025.jpg
            ]
        },
        airforce: {
            fighters: 133, bombers: 0, transport: 112, helicopters: 197,
            name: "Indonesian Air Force (TNI-AU)",
            founded: "April 9, 1946",
            motto: "Swa Bhuwana Paksa (Wings of the Motherland)",
            strength: "35,000 active",
            image: "Indonesia_details/indonesia_airforce_flag.png",
            equipment: [
                { name: "Su-27/30 Flanker", count: 16, type: "Air Superiority Fighter", description: "Russian heavy twin-engine fighter with long range and BVR capability", image: "Indonesia_details/Indonesia_airforce_details/su_27_30_flanker.png" }, // src: upload.wikimedia.org/wikipedia/commons/3/37/Indonesian_Air_Force_Sukhoi_Su-27SKM_Flanker%3B_Halim_Perdanakusuma_%2833142277763%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "F-16 C/D Block 52", count: 33, type: "Multirole Fighter", description: "Upgraded US-built 4th gen multirole fighter", image: "Indonesia_details/Indonesia_airforce_details/f16_c_d_block_52.png" }, // src:https://upload.wikimedia.org/wikipedia/commons/5/55/Indonesian_Air_Force_General_Dynamic_F-16C.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "KF-21 Boramae", count: 0, type: "4.5 Gen Fighter (on order)", description: "Indonesian-Korean jointly developed next-gen fighter — 50 on order", image: "Indonesia_details/Indonesia_airforce_details/kf_21_boramae.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/a/a2/KF21ADEX-20.10.2023_1.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "T-50i Golden Eagle", count: 16, type: "Lead-In Fighter Trainer", description: "Korean-built advanced jet trainer and light combat aircraft", image: "Indonesia_details/Indonesia_airforce_details/t50_i_golden_eagle.png" } // src: https://upload.wikimedia.org/wikipedia/commons/4/45/KAI_T-50i_in_Indonesia_%28modified%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
            ]
        }
    },
    "Canada": {
        name: "Canada",
        flag: "🇨🇦",
        countryCode: "ca",
        rank: 27,
        budget: "$26.9B",
        nuclear: { status: false, warheads: 0, type: "No Program" },
        personnel: { active: 68000, reserve: 27000, paramilitary: 0 },
        description: "Canada's military is a well-trained NATO force focused on Arctic sovereignty, peacekeeping, and interoperability with the United States. It is modernizing its fleet and fighter aircraft.",
        image: "Canada_details/canada_flag.jpg",
        army: {
            tanks: 82, apc: 1800, artillery: 188, mlrs: 0,
            name: "Canadian Army",
            founded: "July 1, 1867",
            motto: "Vigilamus Pro Te (We Watch Over You)",
            strength: "42,000 active",
            image: "Canada_details/canada_army_flag.jpg",
            equipment: [
                { name: "Leopard 2A6M CAN", count: 82, type: "Main Battle Tank", description: "German MBT modified for Canadian service with mine protection", image: "Canada_details/Canada_army_details/leopard_2a6m_can.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/5/58/Leopard_2A6_tank_-_IL%C3%9C_2012.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "LAV 6.0", count: 550, type: "Armored Fighting Vehicle", description: "8x8 combat vehicle — backbone of Canadian mechanized forces", image: "Canada_details/Canada_army_details/lav_6.0.png" }, // src: https://en.wikipedia.org/wiki/LAV_6#/media/File:Saint-Andr%C3%A9-Avelin_27_avril_2019_VBL.jpg
                { name: "M777 Howitzer", count: 37, type: "Towed Howitzer", description: "Ultra-lightweight 155mm field artillery", image: "Canada_details/Canada_army_details/m777_howitzer.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/e/ef/Triple_7_joint_live-fire_exercise_150326-A-AP268-581.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "TAPVs", count: 500, type: "Tactical Patrol Vehicle", description: "Protected mobility vehicles for light forces", image: "Canada_details/Canada_army_details/tapvs.png" } // src: https://en.wikipedia.org/wiki/Textron_tactical_armoured_patrol_vehicle#/media/File:Textron_TAPV_Ottawa_City_Hall_Left_View.jpg
            ]
        },
        navy: {
            carriers: 0, submarines: 4, destroyers: 0, frigates: 12,
            name: "Royal Canadian Navy",
            founded: "May 4, 1910",
            motto: "Ready Aye Ready",
            strength: "12,000 active",
            image: "Canada_details/canada_navy_flag.jpg",
            equipment: [
                { name: "Halifax-class Frigate", count: 12, type: "Multi-Role Frigate", description: "Modernized Canadian patrol frigate with Sea Sparrow and Harpoon missiles", image: "Canada_details/Canada_navy_details/halifax_class_frigate.png" }, // src: https://en.wikipedia.org/wiki/Halifax-class_frigate#/media/File:HMCS_Regina_in_2025.jpg
                { name: "Victoria-class Submarine", count: 4, type: "Patrol Submarine", description: "Ex-British Upholder-class diesel-electric submarine", image: "Canada_details/Canada_navy_details/victoria_class_submarine.png" }, // src: https://en.wikipedia.org/wiki/Upholder/Victoria-class_submarine#/media/File:HMCS_Corner_Brook_in_2025.jpg
                { name: "Harry DeWolf-class AOPV", count: 6, type: "Arctic Patrol Vessel", description: "Ice-capable offshore patrol vessel for Arctic sovereignty", image: "Canada_details/Canada_navy_details/harry_dewolf_class_aopv.png" }, // src: https://en.wikipedia.org/wiki/Harry_DeWolf-class_offshore_patrol_vessel#/media/File:HMCS_Harry_DeWolf_under_way_Sep_2021_(cropped).jpg
                { name: "CSC Frigate", count: 15, type: "Surface Combatant (planned)", description: "Future Canadian Surface Combatant — 15 ships planned to replace Halifax-class", image: "Canada_details/Canada_navy_details/csc_frigate.png" } // src: https://en.wikipedia.org/wiki/River-class_destroyer_(2030s)#/media/File:HMS_Glasgow_(52567292390).jpg
            ]
        },
        airforce: {
            fighters: 94, bombers: 0, transport: 73, helicopters: 145,
            name: "Royal Canadian Air Force",
            founded: "April 1, 1924",
            motto: "Per Ardua Ad Astra (Through Adversity to the Stars)",
            strength: "14,500 active",
            image: "Canada_details/canada_airforce_flag.jpg",
            equipment: [
                { name: "CF-18 Hornet", count: 76, type: "Multirole Fighter", description: "Modernized F/A-18A/B for air defense and strike missions", image: "Canada_details/Canada_airforce_details/cf18_hornet.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/4/4f/CF-18_Hornet_%283870335613%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "F-35A Lightning II", count: 88, type: "5th Gen Stealth Fighter (on order)", description: "88 F-35A ordered to replace CF-18 fleet", image: "Canada_details/Canada_airforce_details/f35a_lightning_ii.png" }, // src: https://en.wikipedia.org/wiki/Lockheed_Martin_F-35_Lightning_II#/media/File:F-35A_flight_(cropped).jpg
                { name: "CC-177 Globemaster III", count: 5, type: "Strategic Transport", description: "Heavy strategic airlift aircraft", image: "Canada_details/Canada_airforce_details/cc177_globemaster_iii.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/a/a8/Boeing_CC-177_Globemaster_III%2C_Canada_-_Air_Force_JP7107563.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "CP-140 Aurora", count: 14, type: "Maritime Patrol", description: "Long-range maritime surveillance and ASW aircraft", image: "Canada_details/Canada_airforce_details/cp140_aurora.png" } // src: https://en.wikipedia.org/wiki/Lockheed_CP-140_Aurora#/media/File:CP-140A_Arcturus.jpg
            ]
        }
    },
    "Taiwan": {
        name: "Republic of China",
        flag: "🇹🇼",
        countryCode: "tw",
        rank: 23,
        budget: "$19.1B",
        nuclear: { status: false, warheads: 0, type: "No Program" },
        personnel: { active: 190000, reserve: 1657000, paramilitary: 17000 },
        description: "Taiwan maintains strong defensive capabilities to deter a potential Chinese invasion. It operates modern US-made equipment and is developing asymmetric warfare strategies.",
        image: "ROC_details/roc_flag.jpg",
        army: {
            tanks: 1100, apc: 2600, artillery: 1600, mlrs: 57,
            name: "Republic of China Army",
            founded: "June 16, 1924",
            motto: "Defend the Nation",
            strength: "130,000 active",
            image: "ROC_details/roc_army_flag.jpg",
            equipment: [
                { name: "M1A2T Abrams", count: 108, type: "Main Battle Tank", description: "US-built MBT purchased for Taiwan with advanced armor and electronics", image: "ROC_details/ROC_army_details/m1a2t_abrams.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/6/61/07.10_%E7%B8%BD%E7%B5%B1%E8%A6%96%E5%B0%8E%E3%80%8CM1A2T%E6%96%B0%E5%BC%8F%E6%88%B0%E8%BB%8A%E6%8F%9B%E8%A3%9D%E8%A8%93%E7%B7%B4%E3%80%8D-54645274900.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "CM-11 Brave Tiger", count: 450, type: "Main Battle Tank", description: "Domestically assembled MBT based on M48/M60 design", image: "ROC_details/ROC_army_details/cm_11_brave_tiger.png" }, // src: https://en.wikipedia.org/wiki/CM11_Brave_Tiger#/media/File:ROCA_CM-11_in_Hukou_Camp_after_Exercise_20111105a.jpg
                { name: "CM-32 Clouded Leopard", count: 600, type: "Infantry Fighting Vehicle", description: "Indigenous 8x8 armored vehicle family", image: "ROC_details/ROC_army_details/cm_32_clouded_leopard.png" }, // src: https://en.wikipedia.org/wiki/Clouded_Leopard_Armored_Vehicle#/media/File:CM-32_Yunpao_APC_Display_at_Hsinchu_AFB_20151121a.jpg
                { name: "Thunderbolt-2000 MLRS", count: 57, type: "MLRS", description: "Domestically developed multiple launch rocket system", image: "ROC_details/ROC_army_details/thunderbolt_2000_mlrs.png" } // src: https://en.wikipedia.org/wiki/Thunderbolt-2000#/media/File:Thunderbolt_2000_MLRS_in_Hukou_Camp_Open_day_20111105.jpg
            ]
        },
        navy: {
            carriers: 0, submarines: 4, destroyers: 4, frigates: 22,
            name: "Republic of China Navy",
            founded: "December 1, 1924",
            motto: "Seas of Honor",
            strength: "40,000 active",
            image: "ROC_details/roc_navy_flag.jpg",
            equipment: [
                { name: "Hai Kun-class Submarine", count: 1, type: "Indigenous Submarine", description: "Taiwan's first domestically built submarine (commissioned 2025)", image: "ROC_details/ROC_navy_details/hai_kun_class_submarine.png" }, // src: AI - Generated image
                { name: "Kee Lung-class Destroyer", count: 4, type: "Guided Missile Destroyer", description: "Ex-US Kidd-class with SM-2 SAMs and Harpoon missiles", image: "ROC_details/ROC_navy_details/kee_lung_class_destroyer.png" }, // src: https://en.wikipedia.org/wiki/ROCS_Kee_Lung#/media/File:ROCS_Kee_Lung_(DDG-1801).jpg
                { name: "Cheng Kung-class Frigate", count: 8, type: "Guided Missile Frigate", description: "Taiwan-built Perry-class with SM-1 and Hsiung Feng missiles", image: "ROC_details/ROC_navy_details/cheng_kung_class_frigate.png" }, // src: https://en.wikipedia.org/wiki/Cheng_Kung-class_frigate#/media/File:Tzu_I_Shipped_in_No.12_Pier_of_Zhongzheng_Naval_Base_20130504a.jpg
                { name: "Tuo Chiang-class Corvette", count: 6, type: "Stealth Corvette", description: "Fast catamaran stealth corvette with anti-ship missiles", image: "ROC_details/ROC_navy_details/tuo_chiang_class_corvette.png" } // src: https://en.wikipedia.org/wiki/Tuo_Chiang-class_corvette#/media/File:03.26_%E7%B8%BD%E7%B5%B1%E4%B8%BB%E6%8C%81%E3%80%8C%E6%B5%B7%E8%BB%8D%E9%AB%98%E6%95%88%E8%83%BD%E8%89%A6%E8%89%87%E5%AE%89%E6%B1%9F%E5%8F%8A%E8%90%AC%E6%B1%9F%E8%BB%8D%E8%89%A6%E4%BA%A4%E8%89%A6%E5%85%B8%E7%A6%AE%E3%80%8D_-_53611020077.jpg
            ]
        },
        airforce: {
            fighters: 286, bombers: 0, transport: 68, helicopters: 256,
            name: "Republic of China Air Force",
            founded: "August 1, 1920",
            motto: "Above the Heavens",
            strength: "35,000 active",
            image: "ROC_details/roc_airforce_flag.jpg",
            equipment: [
                { name: "F-16V Viper", count: 141, type: "Multirole Fighter", description: "Upgraded Block 70/72 F-16 with AESA radar — most advanced F-16 variant", image: "ROC_details/ROC_airforce_details/f16_v_viper.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/3/3a/Taiwan_F-16_Debate_-_Flickr_-_Al_Jazeera_English_%283%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Mirage 2000-5", count: 47, type: "Multirole Fighter", description: "French-built delta-wing fighter with MICA missiles", image: "ROC_details/ROC_airforce_details/mirage_2000_5.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/9/98/Dassault_Mirage_2000-5DI_%E2%80%982061_DI11%E2%80%99_%2855238039702%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "AIDC F-CK-1 Ching-kuo", count: 127, type: "Light Fighter", description: "Indigenous defense fighter for air defense and ground attack", image: "ROC_details/ROC_airforce_details/aidc_f_ck_1_ching_kuo.png" }, // src: https://en.wikipedia.org/wiki/AIDC_F-CK-1_Ching-kuo#/media/File:IDF-Wan_Chien.jpg
                { name: "E-2K Hawkeye", count: 6, type: "AEW&C", description: "US-built airborne early warning aircraft for air battle management", image: "ROC_details/ROC_airforce_details/e2_k_hawkeye.png" } // src: https://en.wikipedia.org/wiki/Grumman_E-2_Hawkeye#/media/File:E-2K_in_Songshan_Air_Force_Base_20110813.jpg
            ]
        }
    },
    "Greece": {
        name: "Greece",
        flag: "🇬🇷",
        countryCode: "gr",
        rank: 28,
        budget: "$8.7B",
        nuclear: { status: false, warheads: 0, type: "No Program" },
        personnel: { active: 143000, reserve: 220000, paramilitary: 4000 },
        description: "Greece maintains one of the largest militaries in NATO Europe relative to population, driven by tensions with Turkey over the Aegean Sea and Cyprus.",
        image: "Greece_details/greece_flag.jpg",
        army: {
            tanks: 1367, apc: 3000, artillery: 1800, mlrs: 198,
            name: "Hellenic Army",
            founded: "1828",
            motto: "Freedom or Death",
            strength: "99,000 active",
            image: "Greece_details/greece_army_flag.png",
            equipment: [
                { name: "Leopard 2A6 HEL", count: 170, type: "Main Battle Tank", description: "German-built heavy MBT with L/55 120mm gun", image: "Greece_details/Greece_army_details/leopard_2a6_hel.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/1/1c/Leopard_2A6_HEL_%282%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Leopard 2A4", count: 183, type: "Main Battle Tank", description: "German MBT forming backbone of armored forces", image: "Greece_details/Greece_army_details/leopard_2a4.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/0/0e/West_German_Leopard_2A4_in_camouflage.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Leopard 1A5", count: 501, type: "Main Battle Tank", description: "Older German MBT still in service", image: "Greece_details/Greece_army_details/leopard_1a5.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/5/50/Leopard_1A4_battle_tank_in_Athens_on_March_25%2C_2024.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "M270 MLRS", count: 36, type: "MLRS", description: "US-built multiple launch rocket system with ATACMS capability", image: "Greece_details/Greece_army_details/m270_mlrs.png" } // src: https://en.wikipedia.org/wiki/M270_Multiple_Launch_Rocket_System#/media/File:M270A1_Multiple_Launch_Rocket_System_South_Dakota_ANG.jpg
            ]
        },
        navy: {
            carriers: 0, submarines: 11, destroyers: 0, frigates: 13,
            name: "Hellenic Navy",
            founded: "1821",
            motto: "My Country, Right or Wrong",
            strength: "19,000 active",
            image: "Greece_details/greece_navy_flag.png",
            equipment: [
                { name: "Type 214 Submarine", count: 4, type: "AIP Submarine", description: "German-built air-independent propulsion submarine with stealth features", image: "Greece_details/Greece_navy_details/type_214_submarine.png" }, // src: https://en.wikipedia.org/wiki/Type_214_submarine#/media/File:S-120_Papanikolis_1.jpg
                { name: "Type 209 Submarine", count: 7, type: "Attack Submarine", description: "German-designed patrol submarine", image: "Greece_details/Greece_navy_details/type_209_submarine.png" }, // src: https://en.wikipedia.org/wiki/Type_209_submarine#/media/File:S-118_Okeanos_1.jpg
                { name: "Hydra-class Frigate", count: 4, type: "Guided Missile Frigate", description: "MEKO 200 design with Harpoon and Sea Sparrow", image: "Greece_details/Greece_navy_details/hydra_class_frigate.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/c/c9/HS_Hydra_F452_at_Salamis_Naval_Base%2C_Greece.jpg
                { name: "FDI HN Frigate", count: 3, type: "Modern Frigate (on order)", description: "French Belharra-class with Aster-30 SAM — cutting edge European design", image: "Greece_details/Greece_navy_details/fdi_hn_frigate.png" } // src: hhttps://en.wikipedia.org/wiki/Amiral_Ronarc%27h-class_frigate#/media/File:RonarchSide.jpg
            ]
        },
        airforce: {
            fighters: 243, bombers: 0, transport: 52, helicopters: 214,
            name: "Hellenic Air Force",
            founded: "November 11, 1930",
            motto: "Always Dare",
            strength: "26,600 active",
            image: "Greece_details/greece_airforce_flag.jpg",
            equipment: [
                { name: "F-16 Block 52+/Viper", count: 154, type: "Multirole Fighter", description: "84 upgraded to Viper configuration with AESA radar", image: "Greece_details/Greece_airforce_details/f16_block_52_viper.png" }, // src: https://en.wikipedia.org/wiki/General_Dynamics_F-16_Fighting_Falcon_variants#/media/File:Greek_F-16_Block52_Falcon_1.jpg
                { name: "Rafale F3R", count: 24, type: "Multirole Fighter", description: "French 4.5-gen omnirole fighter with Meteor missiles", image: "Greece_details/Greece_airforce_details/rafale_f3r.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/9/9c/U_S_F-35s_join_NATO_Allies_in_Ramstein_Flag_for_cutting-edge_air_force_integration%2C_training_%288682223%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Mirage 2000-5", count: 25, type: "Air Defense Fighter", description: "French interceptor with MICA missiles", image: "Greece_details/Greece_airforce_details/mirage_2000_5.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/d/d1/Dassault_Mirage_2000-5_participating_in_Odyssey_Dawn_%28cropped%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "F-35A Lightning II", count: 40, type: "5th Gen Fighter (on order)", description: "40 F-35A approved for purchase — will transform Greek air power", image: "Greece_details/Greece_airforce_details/f35a_lightning_ii.png" } // src: https://upload.wikimedia.org/wikipedia/commons/a/ab/U_S_F-35s_launch_into_Ramstein_Flag_exercise_alongside_NATO_allies_%288673792%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
            ]
        }
    },
    "Vietnam": {
        name: "Vietnam",
        flag: "🇻🇳",
        countryCode: "vn",
        rank: 20,
        budget: "$7.9B",
        nuclear: { status: false, warheads: 0, type: "No Program" },
        personnel: { active: 482000, reserve: 5000000, paramilitary: 40000 },
        description: "Vietnam's military is battle-hardened and focused on territorial defense, particularly in the South China Sea against Chinese encroachment. It operates a growing submarine fleet.",
        image: "Vietnam_details/vietnam_flag.jpg",
        army: {
            tanks: 2575, apc: 2500, artillery: 2700, mlrs: 468,
            name: "Vietnam People's Army",
            founded: "December 22, 1944",
            motto: "Determined to Win",
            strength: "412,000 active",
            image: "Vietnam_details/vietnam_army_flag.jpg",
            equipment: [
                { name: "T-90S/SK", count: 64, type: "Main Battle Tank", description: "Russian 3rd-gen MBT with modern fire control and Shtora APS", image: "Vietnam_details/vietnam_army_details/t90_s_sk.png" }, // src: https://en.wikipedia.org/wiki/T-90#/media/File:Indian_Army_T-90.jpg
                { name: "T-54/55/M3", count: 1400, type: "Main Battle Tank", description: "Modernized Cold War-era tanks with improved electronics", image: "Vietnam_details/vietnam_army_details/t54_55_m3.png" }, // src: https://en.wikipedia.org/wiki/T-54/T-55#/media/File:T-55_4.jpg
                { name: "BMP-1/2", count: 600, type: "Infantry Fighting Vehicle", description: "Soviet-era armored vehicles upgraded for modern combat", image: "Vietnam_details/vietnam_army_details/bmp_1_2.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/f/f5/%D0%91%D0%9C%D0%9F-1_%D1%81_%D1%83%D1%87%D0%B5%D0%B1%D0%BD%D0%BE%D0%B3%D0%BE_%D0%BF%D0%BE%D0%BB%D0%B8%D0%B3%D0%BE%D0%BD%D0%B0_%D0%90%D0%BB%D0%BC%D0%B0%D1%82%D0%B8%D0%BD%D1%81%D0%BA%D0%BE%D0%B3%D0%BE_%D0%98%D0%BD%D1%81%D1%82%D0%B8%D1%82%D1%83%D1%82%D0%B0_%D0%A1%D1%83%D1%85%D0%BE%D0%BF%D1%83%D1%82%D0%BD%D1%8B%D1%85_%D0%92%D0%BE%D0%B9%D1%81%D0%BA.JPG?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "BM-21 Grad", count: 350, type: "MLRS", description: "122mm multiple rocket launcher on truck chassis", image: "Vietnam_details/vietnam_army_details/bm_21_grad.png" } // src: https://en.wikipedia.org/wiki/BM-21_Grad#/media/File:Russian_BM-21_Grad_in_Saint_Petersburg.JPG
            ]
        },
        navy: {
            carriers: 0, submarines: 6, destroyers: 0, frigates: 6,
            name: "Vietnam People's Navy",
            founded: "May 7, 1955",
            motto: "Defend the Seas",
            strength: "40,000 active",
            image: "Vietnam_details/vietnam_navy_flag.jpg",
            equipment: [
                { name: "Kilo-class Submarine", count: 6, type: "Attack Submarine", description: "Russian 'Black Hole' diesel-electric sub with Kalibr cruise missile capability", image: "Vietnam_details/vietnam_navy_details/kilo_class_submarine.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/6/64/Kilo_Vietnam_Submarine.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Gepard-class Frigate", count: 4, type: "Guided Missile Frigate", description: "Russian-built light frigate with Kh-35 anti-ship missiles", image: "Vietnam_details/vietnam_navy_details/gepard_class_frigate.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/e/e1/Vietnam_People%27s_Navy_ship_015_Tr%E1%BA%A7n_H%C6%B0ng_%C4%90%E1%BA%A1o_-_Project_11661E_Gepard_3.9_frigate.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Molniya-class Corvette", count: 10, type: "Missile Corvette", description: "Russian fast attack craft with Kh-35 anti-ship missiles", image: "Vietnam_details/vietnam_navy_details/molniya_class_corvette.png" }, // src: https://en.wikipedia.org/wiki/Tarantul-class_corvette#/media/File:ORP_Metalowiec_in_Gdynia.JPG
                { name: "BPS-500 Corvette", count: 2, type: "Corvette", description: "Domestically built patrol corvette", image: "Vietnam_details/vietnam_navy_details/bps_500_corvette.png" } // src: https://en.wikipedia.org/wiki/BPS-500_missile_boat#/media/File:Vietnam_People's_Navy_Ship_381_(BPS-500).jpg
            ]
        },
        airforce: {
            fighters: 217, bombers: 0, transport: 60, helicopters: 160,
            name: "Vietnam People's Air Force",
            founded: "March 3, 1955",
            motto: "Masters of the Sky",
            strength: "30,000 active",
            image: "Vietnam_details/vietnam_airforce_flag.jpg",
            equipment: [
                { name: "Su-30MK2V", count: 36, type: "Multirole Fighter", description: "Russian twin-engine heavy fighter with anti-ship capability", image: "Vietnam_details/vietnam_airforce_details/su_30mk2_v.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/7/7f/Su-30MK2_and_Kh-25.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Su-27SK/UBK", count: 12, type: "Air Superiority Fighter", description: "Russian air dominance fighter with BVR missiles", image: "Vietnam_details/vietnam_airforce_details/su_27sk_ubk.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/0/04/Su-27_8_August_2011.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "S-300PMU1", count: 12, type: "SAM System (batteries)", description: "Russian long-range air defense system", image: "Vietnam_details/vietnam_airforce_details/s_300pmu1.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/a/af/MoscowParade2009_7.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Yak-130", count: 12, type: "Advanced Jet Trainer", description: "Russian trainer and light combat aircraft", image: "Vietnam_details/vietnam_airforce_details/yak_130.png" } // src: https://upload.wikimedia.org/wikipedia/commons/f/f5/Yak-130_s%E1%BB%91_hi%E1%BB%87u_2109_thu%E1%BB%99c_KQNDVN.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
            ]
        }
    },
    "Singapore": {
        name: "Singapore",
        flag: "🇸🇬",
        countryCode: "sg",
        rank: 42,
        budget: "$16.1B",
        nuclear: { status: false, warheads: 0, type: "No Program" },
        personnel: { active: 72000, reserve: 300000, paramilitary: 93000 },
        description: "Despite its tiny size, Singapore fields one of the most technologically advanced militaries in Asia with heavy defense spending per capita and cutting-edge equipment.",
        image: "Singapore_details/singapore_flag.jpg",
        army: {
            tanks: 212, apc: 2200, artillery: 283, mlrs: 18,
            name: "Singapore Army",
            founded: "1965",
            motto: "Training to Fight, Fighting to Win",
            strength: "50,000 active",
            image: "Singapore_details/singapore_army_flag.png",  //AI-generated image
            equipment: [
                { name: "Leopard 2SG", count: 96, type: "Main Battle Tank", description: "Upgraded Leopard 2A4 with AMAP composite armor package", image: "Singapore_details/singapore_army_details/leopard_2sg.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/9/9b/81032MID_Singapore_Armed_Forces_Leopard_2SG_Tank.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Hunter AFV", count: 100, type: "Infantry Fighting Vehicle", description: "Domestically developed next-gen IFV with 30mm cannon and ATGM", image: "Singapore_details/singapore_army_details/hunter_afv.png" }, // src: https://en.wikipedia.org/wiki/Hunter_AFV#/media/File:Hunter_AFV_of_the_Singapore_Army.jpg/2
                { name: "Bionix 25/40 IFV", count: 400, type: "Infantry Fighting Vehicle", description: "Singapore-built tracked IFV with 25mm/40mm cannon variants", image: "Singapore_details/singapore_army_details/bionix_25_40_ifv.png" }, // src: https://en.wikipedia.org/wiki/Bionix_(family_of_armoured_fighting_vehicles)#/media/File:Bionix_AFV_1.jpg
                { name: "HIMARS", count: 18, type: "MLRS", description: "US-built High Mobility Artillery Rocket System", image: "Singapore_details/singapore_army_details/himars.png" } // src: https://upload.wikimedia.org/wikipedia/commons/6/66/180614-A-IY962-102_-_M142_High_Mobility_Artillery_Rocket_System_%28HIMARS%29_firing_during_Saber_Strike_18_%28Image_4_of_7%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
            ]
        },
        navy: {
            carriers: 0, submarines: 4, destroyers: 0, frigates: 6,
            name: "Republic of Singapore Navy",
            founded: "1967",
            motto: "Defending Our Shores",
            strength: "9,000 active",
            image: "Singapore_details/singapore_navy_flag.png",     //AI-generated image
            equipment: [
                { name: "Invincible-class Submarine", count: 4, type: "AIP Submarine", description: "Type 218SG — Germany's most advanced export submarine with AIP", image: "Singapore_details/singapore_navy_details/invincible_class_submarine.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/9/9e/Naval_Ships_in_Kiel_07.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Formidable-class Frigate", count: 6, type: "Stealth Frigate", description: "French La Fayette-derived stealth frigate with Aster SAM", image: "Singapore_details/singapore_navy_details/formidable_class_frigate.png" }, // src : https://en.wikipedia.org/wiki/Formidable-class_frigate#/media/File:Singapore_Navy_guided-missile_frigate_RSS_Steadfast.jpg
                { name: "Independence-class LMV", count: 8, type: "Littoral Mission Vessel", description: "Multi-role naval vessel for maritime security", image: "Singapore_details/singapore_navy_details/independence_class_lmv.png" }, // src: https://en.wikipedia.org/wiki/Independence-class_littoral_mission_vessel#/media/File:RSS_Fortitude_in_2018.jpg
                { name: "Endurance-class LST", count: 4, type: "Landing Ship", description: "Amphibious transport dock for sealift operations", image: "Singapore_details/singapore_navy_details/endurance_class_lst.png" } // src: https://en.wikipedia.org/wiki/Endurance-class_landing_platform_dock#/media/File:Singapore_Strait_Passing_warship.jpg
            ]
        },
        airforce: {
            fighters: 98, bombers: 0, transport: 40, helicopters: 80,
            name: "Republic of Singapore Air Force",
            founded: "September 1, 1968",
            motto: "Above All",
            strength: "13,500 active",
            image: "Singapore_details/singapore_airforce_flag.png",     //AI-generated image
            equipment: [
                { name: "F-15SG Strike Eagle", count: 40, type: "Air Superiority Fighter", description: "Advanced variant of F-15E with conformal fuel tanks and AESA radar", image: "Singapore_details/singapore_airforce_details/f15_sg_strike_eagle.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/d/d6/05-8361_Boeing_F-15SG_Strike_Eagle_428th_Fighter_Squadron_%22Buccaneers%22_Republic_of_Singapore_Air_Force.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "F-16D+ Block 52", count: 60, type: "Multirole Fighter", description: "Two-seat variant with conformal fuel tanks and advanced avionics", image: "Singapore_details/singapore_airforce_details/f16_d_block_52.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/6/6f/RSAF_F-16D_Block_52%2B_Fighting_Falcon_with_Conformal_Fuel_Tanks_01.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "F-35B Lightning II", count: 12, type: "5th Gen STOVL Fighter", description: "Short takeoff/vertical landing stealth fighter (first batch delivered)", image: "Singapore_details/singapore_airforce_details/f35b_lightning_ii.png" }, // src: https://en.wikipedia.org/wiki/Lockheed_Martin_F-35_Lightning_II#/media/File:U.S._Marine_Corps_F-35B_Lands_on_JS_Izumo._Image_17_of_35.jpg
                { name: "G550 AEW", count: 4, type: "AEW&C", description: "Gulfstream-based airborne early warning aircraft with EL/W-2085 radar", image: "Singapore_details/singapore_airforce_details/g550_aew.png" } // src: https://en.wikipedia.org/wiki/EL/W-2085#/media/File:RSAF_Gulfstream_IAI_G550_CAEW_(cropped).jpg
            ]
        }
    },
    "UAE": {
        name: "United Arab Emirates",
        flag: "🇦🇪",
        countryCode: "ae",
        rank: 37,
        budget: "$23.5B",
        nuclear: { status: false, warheads: 0, type: "No Program" },
        personnel: { active: 63000, reserve: 0, paramilitary: 0 },
        description: "The UAE operates one of the most sophisticated and well-equipped militaries in the Middle East, with advanced Western and indigenous weapons systems and combat experience in Yemen.",
        image: "UAE_details/uae_flag.jpg",
        army: {
            tanks: 549, apc: 2600, artillery: 397, mlrs: 72,
            name: "UAE Land Forces",
            founded: "1971",
            motto: "Strength and Honor",
            strength: "44,000 active",
            image: "UAE_details/uae_army_flag.jpg",
            equipment: [
                { name: "Leclerc MBT", count: 388, type: "Main Battle Tank", description: "French 3rd-gen MBT with autoloader, CITV, and composite armor — UAE is largest operator", image: "UAE_details/uae_army_details/leclerc_mbt.png" }, // src: https://en.wikipedia.org/wiki/Leclerc_(tank)#/media/File:Leclerc-openphotonet_PICT6015.JPG
                { name: "BMP-3", count: 700, type: "Infantry Fighting Vehicle", description: "Russian IFV with 100mm gun and ATGM", image: "UAE_details/uae_army_details/bmp_3.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/c/cc/UAE_Army_BMP-3_at_IDEX_2023.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Rabdan 8x8 IFV", count: 400, type: "Infantry Fighting Vehicle", description: "Domestically assembled modern IFV", image: "UAE_details/uae_army_details/rabdan_8x8_ifv.png" }, // src: https://en.wikipedia.org/wiki/Otokar_Arma#/media/File:Rabdan_8x8_in_Indo_Defence_2024.jpg
                { name: "Jobaria MLRS", count: 72, type: "MLRS", description: "UAE-developed multi-barrel rocket launcher system", image: "UAE_details/uae_army_details/jobaria_mlrs.png" } // AI - Generated image
            ]
        },
        navy: {
            carriers: 0, submarines: 0, destroyers: 0, frigates: 4,
            name: "UAE Navy",
            founded: "1971",
            motto: "Shield of the Coast",
            strength: "6,500 active",
            image: "UAE_details/uae_navy_flag.png",
            equipment: [
                { name: "Gowind-class Corvette", count: 2, type: "Corvette", description: "French-built modern multi-mission corvette", image: "UAE_details/uae_navy_details/gowind_class_corvette.png" }, // src: https://en.wikipedia.org/wiki/Gowind-class_design#/media/File:Al_Emaraat.webp
                { name: "Abu Dhabi-class Corvette", count: 6, type: "Corvette", description: "Italian Falaj 2-class corvettes with Exocet missiles", image: "UAE_details/uae_navy_details/abu_dhabi_class_corvette.png" }, // src: AI - Generated Image
                { name: "Baynunah-class Corvette", count: 6, type: "Missile Corvette", description: "French-designed indigenously built corvettes", image: "UAE_details/uae_navy_details/baynunah_class_corvette.png" }, // src: https://en.wikipedia.org/wiki/Baynunah-class_corvette#/media/File:Baynunah-class_corvette_Al_Dhafra_P-173_at_NAVDEX.JPG
                { name: "Ghannatha-class FAC", count: 12, type: "Fast Attack Craft", description: "Catamaran missile boats for coastal defense", image: "UAE_details/uae_navy_details/ghannatha_class_fac.png" } // src: AI -Generated Image
            ]
        },
        airforce: {
            fighters: 164, bombers: 0, transport: 38, helicopters: 195,
            name: "UAE Air Force",
            founded: "1968",
            motto: "Strike with Precision",
            strength: "12,000 active",
            image: "UAE_details/uae_airforce_flag.jpg",
            equipment: [
                { name: "F-16E/F Block 60 Desert Falcon", count: 80, type: "Multirole Fighter", description: "Most advanced F-16 variant with conformal fuel tanks and AESA radar", image: "UAE_details/uae_airforce_details/f16e_f_block_60_desert_falcon.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/e/e0/F-16e_block60.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Mirage 2000-9", count: 62, type: "Multirole Fighter", description: "Upgraded French fighter with advanced strike capability", image: "UAE_details/uae_airforce_details/mirage_2000_9.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/8/80/UAEAF_Mirage_2000-9_at_Dubai_Airshow_2023.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Dassault Rafale", count: 80, type: "Multirole Fighter (on order)", description: "French 4.5-gen omnirole fighter — 80 on order", image: "UAE_details/uae_airforce_details/dassault_rafale.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/9/91/Dassault_Rafale_B_Suisse.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "THAAD", count: 2, type: "Ballistic Missile Defense (batteries)", description: "US terminal high altitude area defense against ballistic missiles", image: "UAE_details/uae_airforce_details/thaad.png" } // src: https://upload.wikimedia.org/wikipedia/commons/4/45/The_first_of_two_Terminal_High_Altitude_Area_Defense_%28THAAD%29_interceptors_is_launched_during_a_successful_intercept_test_-_US_Army.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
            ]
        }
    },
    "SouthAfrica": {
        name: "South Africa",
        flag: "🇿🇦",
        countryCode: "za",
        rank: 33,
        budget: "$3.1B",
        nuclear: { status: false, warheads: 0, type: "Dismantled (had 6)" },
        personnel: { active: 73000, reserve: 15000, paramilitary: 0 },
        description: "South Africa is the most powerful military in sub-Saharan Africa. Once a nuclear weapon state, it voluntarily dismantled its arsenal. Its defense industry produces world-class armored vehicles and artillery.",
        image: "SouthAfrica_details/southafrica_flag.jpg",
        army: {
            tanks: 195, apc: 2070, artillery: 1367, mlrs: 100,
            name: "South African Army",
            founded: "July 1, 1912",
            motto: "Ex Unitate Vires (From Unity, Strength)",
            strength: "40,100 active",
            image: "SouthAfrica_details/southafrica_army_flag.jpg",
            equipment: [
                { name: "Olifant Mk2", count: 44, type: "Main Battle Tank", description: "Locally upgraded Centurion MBT with 105mm gun", image: "SouthAfrica_details/southafrica_army_details/olifant_mk2.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/b/b3/Olifant_Mark_2_Waterkloof.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Ratel 20/90 IFV", count: 1300, type: "Infantry Fighting Vehicle", description: "South African mine-protected wheeled IFV", image: "SouthAfrica_details/southafrica_army_details/ratel_20_90.png" }, // src: https://en.wikipedia.org/wiki/Ratel_IFV#/media/File:Ratel_90_armyrecognition_South-Africa_008_(cropped).jpg
                { name: "Rooikat 76", count: 242, type: "Armored Car", description: "Fast 8x8 wheeled tank destroyer with 76mm gun", image: "SouthAfrica_details/southafrica_army_details/rooikat_76.png" }, // src: https://en.wikipedia.org/wiki/Rooikat#/media/File:Rooikat_Armoured_Car_(9686598433)_(cropped).jpg
                { name: "G6 Rhino", count: 43, type: "Self-Propelled Howitzer", description: "6x6 wheeled 155mm howitzer — one of the best in the world", image: "SouthAfrica_details/southafrica_army_details/g6_rhino.png" } // src: https://en.wikipedia.org/wiki/G6_howitzer#/media/File:Denel_G6-45_Ysterplaat_Airshow_2006.jpg
            ]
        },
        navy: {
            carriers: 0, submarines: 3, destroyers: 0, frigates: 4,
            name: "South African Navy",
            founded: "April 1, 1922",
            motto: "Ex Aequo Et Bono",
            strength: "7,500 active",
            image: "SouthAfrica_details/southafrica_navy_flag.jpg",
            equipment: [
                { name: "Type 209/1400 Submarine", count: 3, type: "Patrol Submarine", description: "German-built diesel-electric submarine", image: "SouthAfrica_details/southafrica_navy_details/type_209_1400_submarine.png" }, // src: https://en.wikipedia.org/wiki/Heroine-class_submarine#/media/File:SAS_Charlotte_Maxeke_with_HMS_Portland_MOD_45157758.jpg
                { name: "Valour-class Frigate", count: 4, type: "Stealth Frigate", description: "German MEKO A-200 stealth frigate with Exocet and Umkhonto SAM", image: "SouthAfrica_details/southafrica_navy_details/valour_class_frigate.png" }, // src: https://en.wikipedia.org/wiki/Valour-class_frigate#/media/File:SAS_Spioenkop_during_Exercise_IBSAMAR_V_(cropped).JPG
                { name: "SAS Drakensberg", count: 1, type: "Replenishment Ship", description: "Combat support ship for fleet replenishment", image: "SouthAfrica_details/southafrica_navy_details/sas_drakensberg.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/f/fa/SAS_Drakensberg_A301_c.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Warrior-class OPV", count: 3, type: "Offshore Patrol Vessel", description: "Multi-role patrol vessel for maritime security", image: "SouthAfrica_details/southafrica_navy_details/warrior_class_opv.png" } // src: https://en.wikipedia.org/wiki/Warrior-class_inshore_patrol_vessel#/media/File:SAS_King_Sekhukhune_I_underway_off_Simonstown.jpg
            ]
        },
        airforce: {
            fighters: 35, bombers: 0, transport: 89, helicopters: 77,
            name: "South African Air Force",
            founded: "February 1, 1920",
            motto: "Per Aspera Ad Astra (Through Hardship to the Stars)",
            strength: "10,300 active",
            image: "SouthAfrica_details/southafrica_airforce_flag.jpg",
            equipment: [
                { name: "JAS-39 Gripen C/D", count: 26, type: "Multirole Fighter", description: "Swedish 4.5-gen fighter with Darter and A-Darter missiles", image: "SouthAfrica_details/southafrica_airforce_details/jas_39_gripen_c_d.png" }, // src: https://commons.wikimedia.org/wiki/File:Saab_JAS-39C_Gripen_3924_24_(8376596238).jpg
                { name: "BAE Hawk Mk120", count: 24, type: "Lead-In Fighter Trainer", description: "British jet trainer and light combat aircraft", image: "SouthAfrica_details/southafrica_airforce_details/bae_hawk_mk120.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/7/75/SAAF_Hawk_MK120_261_%282%29_%286921224399%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "C-130BZ Hercules", count: 7, type: "Transport Aircraft", description: "Workhorse tactical transport aircraft", image: "SouthAfrica_details/southafrica_airforce_details/c_130bz_hercules.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/0/00/401_2004-04-27_FAWK_003_crop_LR_800x533.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "Rooivalk CSH-2", count: 11, type: "Attack Helicopter", description: "Domestically built attack helicopter — Africa's only indigenous combat helicopter", image: "SouthAfrica_details/southafrica_airforce_details/rooivalk_csh_2.png" } // src: https://en.wikipedia.org/wiki/Denel_Rooivalk#/media/File:Rooivalk_in_flight_(cropped).jpg
            ]
        }
    },
    "Mexico": {
        name: "Mexico",
        flag: "🇲🇽",
        countryCode: "mx",
        rank: 34,
        budget: "$11.6B",
        nuclear: { status: false, warheads: 0, type: "No Program" },
        personnel: { active: 277000, reserve: 81000, paramilitary: 111000 },
        description: "Mexico's military is primarily focused on internal security, counter-narcotics, and disaster relief. It is modernizing with new naval vessels and expanding National Guard operations.",
        image: "Mexico_details/mexico_flag.jpg",
        army: {
            tanks: 0, apc: 700, artillery: 195, mlrs: 0,
            name: "Mexican Army (Ejército Mexicano)",
            founded: "1821",
            motto: "Fidelity, Patriotism, Honor",
            strength: "198,000 active",
            image: "Mexico_details/mexico_army_flag.png",
            equipment: [
                { name: "DN-XI Caballo APC", count: 220, type: "Armored Personnel Carrier", description: "Domestically built 4x4/6x6 armored vehicle", image: "Mexico_details/mexico_army_details/dn_xi_caballo_apc.png" }, // src: https://es.wikipedia.org/wiki/DGIM_DN-XI#/media/Archivo:DN-XI_armored_personnel_carrier.jpg
                { name: "Oshkosh Sandcat", count: 250, type: "MRAP", description: "Mine-resistant vehicle for counter-narco operations", image: "Mexico_details/mexico_army_details/oskhosh_sandcat.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/2/2f/Ej%C3%A9rcitoExpoPuebla1.JPG?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "AMX-VCI APC", count: 100, type: "Armored Personnel Carrier", description: "French-built tracked APC", image: "Mexico_details/mexico_army_details/amx_vci_apc.png" }, //src: https://en.wikipedia.org/wiki/AMX-VCI#/media/File:AMX-VCI_del_Ej%C3%A9rcito_Mexicano.jpg
                { name: "MD 530F Cayuse", count: 24, type: "Light Attack Helicopter", description: "Light helicopter armed for counter-narcotics", image: "Mexico_details/mexico_army_details/md_530f_cayuse.png" } // src: https://en.wikipedia.org/wiki/McDonnell_Douglas_MD_500_Defender#/media/File:Hughes_530MG,_PROLOG_'85.JPEG
            ]
        },
        navy: {
            carriers: 0, submarines: 0, destroyers: 0, frigates: 1,
            name: "Mexican Navy (Armada de México)",
            founded: "November 23, 1821",
            motto: "Mexico, Homeland, Honor, Loyalty",
            strength: "63,000 active (incl. Marines)",
            image: "Mexico_details/mexico_navy_flag.png",
            equipment: [
                { name: "Reformador-class Frigate (POLA-101)", count: 1, type: "Guided Missile Frigate", description: "Damen SIGMA 10514-based long-range ocean patrol frigate (ARM Benito Juárez POLA-101, formerly ARM Reformador), armed with Harpoon missiles, RAM SAM, and torpedoes.", image: "Mexico_details/mexico_navy_details/arm_reformador_frigate.png" }, // src: https://en.wikipedia.org/wiki/ARM_Benito_Ju%C3%A1rez_(POLA-101)#/media/File:ARM_Benito_Ju%C3%A1rez_in_2025.jpg
                { name: "Oaxaca-class OPV", count: 8, type: "Offshore Patrol Vessel", description: "Domestically built 1,680-ton ocean patrol vessels equipped with a helicopter flight deck and 76mm main gun for EEZ surveillance.", image: "Mexico_details/mexico_navy_details/oaxaca_class_opv.png" }, // src: https://en.wikipedia.org/wiki/Oaxaca-class_patrol_vessel#/media/File:Mexican_navy_oaxaca_class.jpg
                { name: "Tenochtitlán-class Patrol Vessel", count: 10, type: "Coastal Patrol Vessel", description: "Mexican-built coastal patrol craft based on the Damen Stan Patrol 4207 design, used for maritime interdiction and surveillance.", image: "Mexico_details/mexico_navy_details/tenochtitlan_class_patrol.png" }, // src: https://en.wikipedia.org/wiki/Tenochtitlan-class_patrol_vessel#/media/File:Patrulla_Costera_ARM_Teotihuacan.jpg
                { name: "Durango-class OPV", count: 4, type: "Offshore Patrol Vessel", description: "Domestically built patrol vessels featuring stealth-contoured superstructures and helicopter helipads for maritime patrol.", image: "Mexico_details/mexico_navy_details/durango_class_opv.png" } // src: https://en.wikipedia.org/wiki/Durango-class_patrol_vessel#/media/File:ARM_Durango.jpg
            ]
        },
        airforce: {
            fighters: 0, bombers: 0, transport: 149, helicopters: 365,
            name: "Mexican Air Force (Fuerza Aérea Mexicana)",
            founded: "February 10, 1915",
            motto: "Honor, Bravery, Loyalty",
            strength: "11,770 active",
            image: "Mexico_details/mexico_airforce_flag.png",
            equipment: [
                { name: "T-6C Texan II", count: 6, type: "Trainer/Light Attack", description: "Advanced turboprop trainer for light strike missions", image: "Mexico_details/mexico_airforce_details/t_6c_texan_ii.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/f/f4/TEXAN_II_T-6C%2B.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "PC-7 Pilatus", count: 60, type: "Trainer/COIN", description: "Swiss turboprop trainer for counter-narcotics", image: "Mexico_details/mexico_airforce_details/pc_7_pilatus.png" }, // src: https://upload.wikimedia.org/wikipedia/commons/c/cf/Pilatus_PC-7%2C_Mexico_-_Air_Force_AN1922411.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original
                { name: "C-130J Hercules", count: 4, type: "Transport Aircraft", description: "Tactical transport for logistics and disaster relief", image: "Mexico_details/mexico_airforce_details/c_130j_hercules.png" }, // src: https://en.wikipedia.org/wiki/Mexican_Air_Force#/media/File:C-130_MK1_FAM_2_(altered).jpg
                { name: "UH-60M Black Hawk", count: 20, type: "Utility Helicopter", description: "US-built utility helicopter for security operations", image: "Mexico_details/mexico_airforce_details/uh_60m_black_hawk.png" } // src: https://en.wikipedia.org/wiki/Sikorsky_UH-60_Black_Hawk#/media/File:Sikorsky_S-70A-24A_Black_Hawk,_Mexico_-_Air_Force_AN2158152.jpg
            ]
        }
    }
};

// Country coordinates for map markers
const countryCoords = {
    "USA": [39.8, -98.5],
    "Russia": [61.5, 105.3],
    "China": [35.8, 104.1],
    "India": [20.5, 78.9],
    "UK": [55.3, -3.4],
    "France": [46.2, 2.2],
    "Germany": [51.1, 10.4],
    "Japan": [36.2, 138.2],
    "SouthKorea": [35.9, 127.7],
    "Turkey": [38.9, 35.2],
    "NorthKorea": [40.3, 127.5],
    "Italy": [41.8, 12.5],
    "Poland": [51.9, 19.1],
    "Ukraine": [48.3, 31.1],
    "Spain": [40.4, -3.7],
    "Netherlands": [52.1, 5.2],
    "Sweden": [60.1, 18.6],
    "Australia": [-25.2, 133.7],
    "Israel": [31.0, 34.8],
    "Egypt": [26.8, 30.8],
    "Pakistan": [30.3, 69.3],
    "Iran": [32.4, 53.7],
    "SaudiArabia": [23.8, 45.0],
    "Brazil": [-14.2, -51.9],
    "Indonesia": [-0.8, 113.9],
    "Canada": [56.1, -106.3],
    "Taiwan": [23.7, 121.0],
    "Greece": [39.1, 21.8],
    "Vietnam": [14.0, 108.2],
    "Singapore": [1.3, 103.8],
    "UAE": [23.4, 53.8],
    "SouthAfrica": [-30.6, 22.9],
    "Mexico": [23.6, -102.5]
};

// Helper function to get flag image URL
function getFlagUrl(countryCode, size = 'w80') {
    return `https://flagcdn.com/${size}/${countryCode}.png`;
}

// Export for use
window.nationsData = nationsData;
window.countryCoords = countryCoords;
window.getFlagUrl = getFlagUrl;
