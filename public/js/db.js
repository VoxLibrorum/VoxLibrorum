/**
 * VOX LIBRORUM - CENTRAL PRESERVATION DATABASE
 * 
 * This file acts as the central "brain" for the application's data.
 * In a future version, this would be replaced by a real backend/database.
 */

const DB = {
    // -------------------------------------------------------------------------
    // ARTIFACTS (The Material Vault)
    // -------------------------------------------------------------------------
    artifacts: [
        {
            id: "MS-1581",
            title: "Concilium Tridentinum (Index Librorum)",
            type: "Manuscript",
            status: "redacted",
            icon: "book",
            summary: "1581 Edition. Council of Trent with the Index of Prohibited Books.",
            desc: "The 'Concilium Tridentinum' featuring the infamous Index Librorum Prohibitorum. Bound in Vellum. This specific copy feels heavier than it should. The pages regarding the 'restrictions of mind' are worn, as if read repeatedly.",
            origin: "Private Collection (Nova)",
            date: "Published MD LXXX (1580)",
            hazard: "Ideological Resonance",
            material: "Pristine Vellum",
            img: "MS-1581_title.jpg"
        },
        {
            id: "MS-902",
            title: "Journal of the Silent Coast",
            type: "Manuscript",
            status: "verified",
            icon: "book",
            summary: "A weathered leather journal found in a drift-wood shack.",
            desc: "A water-damaged leather-bound journal found washed ashore near the Blackwood Lighthouse. The entries stop abruptly on November 12th, 1994. The ink changes color on the final pages.",
            origin: "Blackwood, Sector 4",
            date: "Recovered 1994",
            hazard: "Low (Psychological)",
            material: "Leather, Paper, Salt"
        },
        {
            id: "OBJ-11",
            title: "Iron Key (No Ward)",
            type: "Oddities",
            status: "verified",
            icon: "key",
            summary: "Heavy iron key that fits no known lock in the Sector.",
            desc: "A heavy iron key that does not fit any known lock in the region. When held, it produces a faint vibration that matches the 'hum' heard in the St. Jude basement.",
            origin: "St. Jude Hospital",
            date: "Recovered 2001",
            hazard: "Inert",
            material: "Cold Iron"
        },
        {
            id: "MAP-04",
            title: "Topography of the Sunken City",
            type: "Cartography",
            status: "redacted",
            icon: "map",
            summary: "Map showing streets submerged beneath the Blackwood bay.",
            desc: "A charcoal sketch depicting a coastline that corresponds to the Triassic period, yet includes modern landmarks (the Lighthouse, the Factory).",
            origin: "Unknown Contributor",
            date: "Received 2023",
            hazard: "None",
            material: "Charcoal on Vellum"
        },
        {
            id: "VIA-22",
            title: "Sample: Water from Blackwood",
            type: "Oddities",
            status: "verified",
            icon: "vial",
            summary: "Sealed vial containing water that does not freeze.",
            desc: "A vial of seawater collected during the 'Purple Fog'. It does not freeze, even at -40°C. Light refracts incorrectly through it.",
            origin: "Blackwood Coast",
            date: "Collected 1999",
            hazard: "Medium (Biological)",
            material: "Glass, Seawater"
        },
        {
            id: "EP-88",
            title: "Train Ticket (One Way, 1924)",
            type: "Ephemera",
            status: "verified",
            icon: "ticket",
            summary: "Ticket for the 'Midnight Express', a train route not on record.",
            desc: "A pristine ticket for a train line that never existed. The date represents the day the Vostok station went silent.",
            origin: "Old Station Box",
            date: "Found 2010",
            hazard: "Inert",
            material: "Cardstock"
        },
        {
            id: "MS-104",
            title: "The Unfinished Symphony",
            type: "Manuscript",
            status: "verified",
            icon: "scroll",
            summary: "Sheet music that causes listener unease when played.",
            desc: "Hand-written sheet music. Musicians reporting playing it feel an overwhelming sense of dread.",
            origin: "Conservatory Archive",
            date: "Acquired 1988",
            hazard: "Low (Auditory)",
            material: "Paper, Ink"
        },
        {
            id: "OBJ-00",
            title: "Charred Compass",
            type: "Oddities",
            status: "redacted",
            icon: "compass",
            summary: "Compass that points to 'The Void' instead of North.",
            desc: "A brass compass fused by intense heat. The needle still spins, but ignores magnetic north, tracking an unknown moving point.",
            origin: "Fire Damage Site",
            date: "Recovered 2005",
            hazard: "Unknown",
            material: "Brass, Glass"
        }
    ],

    // -------------------------------------------------------------------------
    // VOICES (Contributors & Profiles)
    // -------------------------------------------------------------------------
    voices: [
        {
            id: "elara-vance",
            name: "Elara Vance",
            role: "Archivist",
            subrole: "Custodian of the Ember Vault",
            bio: "Specializes in the recovery of manuscripts damaged by salt water. Elara has spent the last decade cataloging the 'Drowned Library' collection. Rumored to hold the only known key to the Lower Sanctum.",
            affiliation: "Order of the Key",
            featured: true
        },
        {
            id: "elias-thorne",
            name: "Elias Thorne",
            role: "Witness",
            subrole: "Maritime Witness",
            bio: "Former keeper of the Blackwood Lighthouse. His testimony regarding the 'Purple Fog' phenomena of 1994 remains one of the most cited accounts in the oral history collection.",
            affiliation: "Blackwood Lighthouse (Former)",
            featured: false
        },
        {
            id: "aris-vane",
            name: "Dr. Aris Vane",
            role: "Scholar",
            subrole: "Architecture Historian",
            bio: "A structural historian obsessed with 'impossible geometries' in 18th-century cloisters. Currently leading the restoration project at St. Jude, where the Echo Chamber was discovered.",
            affiliation: "St. Jude Restoration Commitee",
            featured: false
        },
        {
            id: "kaelen-oroy",
            name: "Kaelen Oroy",
            role: "Witness",
            subrole: "Traveler",
            bio: "A cartographer of 'shadow paths.' Kaelen claims to have walked the road depicted in the 'Burning Ship' engraving, though no map shows its existence. Contributes rough sketches and charcoal rubbings.",
            affiliation: "Independent",
            featured: false
        },
        {
            id: "anon-892",
            name: "Anonymous",
            role: "Witness",
            subrole: "Contributor #892",
            bio: "Submitted a collection of letters found in an attic in Vienna. The letters describe a city that overlaps with the real one, visible only at twilight.",
            affiliation: "Unknown",
            featured: false
        },
        {
            id: "julian-black",
            name: "Julian Black",
            role: "Archivist",
            subrole: "Acoustic Archaeology",
            bio: "Focuses on acoustic archaeology. Julian digitizes the 'silent' tapes—recordings of empty rooms that contain unexplained resonances.",
            affiliation: "Vox Audio Lab",
            featured: false
        }
    ],

    // -------------------------------------------------------------------------
    // ORAL HISTORIES (Stories)
    // -------------------------------------------------------------------------
    stories: [
        {
            id: 1,
            title: "The Lighthouse Keeper's Confession",
            contributor: "Elias Thorne",
            summary: "Startling accounts of strange lights seen from the Blackwood Lighthouse during the storm of '94, distinct from any known vessel.",
            tags: ["maritime", "mystery", "1994"],
            era: "Late 20th Century",
            location: "Blackwood Coast",
            status: "public"
        },
        {
            id: 2,
            title: "Whispers of the Old Market",
            contributor: "Sarah Chen",
            summary: "An oral tradition passed down through three generations of stall owners regarding the 'midnight trades' that supposedly occur on the new moon.",
            tags: ["modern", "urban", "folklore"],
            era: "Contemporary",
            location: "New Veridia",
            status: "public"
        },
        {
            id: 3,
            title: "The Sunken Bell",
            contributor: "Capt. H. Sterling",
            summary: "A retrieved logbook entry read aloud, detailing the discovery of a bronze bell four miles off the coast, inscribed with an unknown language.",
            tags: ["maritime", "artifact", "mystery"],
            era: "1920s",
            location: "North Sea",
            status: "public"
        },
        {
            id: 4,
            title: "Echoes of the Cloisters",
            contributor: "Dr. Aris Vane",
            summary: "Architectural anomalies found during the restoration of the St. Jude Abbey, suggesting the building was constructed around something else.",
            tags: ["cloisters", "architecture", "mystery"],
            era: "18th Century",
            location: "St. Jude",
            status: "public"
        },
        {
            id: 5,
            title: "Letters from the Dust Bowl",
            contributor: "Anonymous",
            summary: "A series of letters read by a descendant, describing 'rain that tasted of ash' and figures walking in the dust storms.",
            tags: ["history", "nature"],
            era: "1930s",
            location: "Midwest",
            status: "public"
        },
        {
            id: 6,
            title: "The Silent Choir",
            contributor: "M. Kovac",
            summary: "An audio recording from 1982 that captured a choral performance in an empty cathedral.",
            tags: ["mystery", "audio", "cloisters"],
            era: "1980s",
            location: "Vostok",
            status: "public"
        },
        {
            id: 7,
            title: "Theory of the Salt Line",
            contributor: "Elara Vance",
            summary: "Research notes identifying the boundary where salt water behavior changes during the purple fog events.",
            tags: ["research", "maritime"],
            era: "2023",
            location: "Vox Vault",
            status: "internal"
        }
    ],

    // -------------------------------------------------------------------------
    // ACTIVE PROJECTS (The Desk)
    // -------------------------------------------------------------------------
    projects: [
        {
            id: 'salt-line',
            title: 'The Salt Line',
            description: 'Investigating the recurring phenomena of "purple fog" along the northern coastlines during the late 90s.',
            resources: [
                {
                    id: 'res-001',
                    type: 'oral-history',
                    title: "The Lighthouse Keeper's Confession",
                    summary: '"It was exactly 03:00 hours when the main lamp died. Not flickered, not dimmed—died..."',
                    tags: ['Primary Source', 'Maritime']
                },
                {
                    id: 'res-002',
                    type: 'map',
                    title: "Topography of the Sunken City",
                    summary: "A rough charcoal sketch showing elevation lines that do not match current coastal surveys.",
                    tags: ['Cartography', 'Redacted']
                }
            ],
            aiContext: "System ready. Anomaly detected in coastal elevation metrics."
        },
        {
            id: 'st-jude',
            title: 'St. Jude Anomalies',
            description: 'Records of the medical unexplained events at St. Jude Hospital regarding "dream sharing" cases reported in the pediatric wing.',
            resources: [
                {
                    id: 'res-003',
                    type: 'manuscript',
                    title: "Patient 004 Diary (Excerpts)",
                    summary: '"Shared the same dream again. The gray door was open this time."',
                    tags: ['Journal', 'Medical', 'Verified']
                },
                {
                    id: 'res-004',
                    type: 'photo',
                    title: "Ward C - 1984",
                    summary: "Polaroid showing a shadow cast by an object not present in the room.",
                    tags: ['Photography', 'Evidence']
                },
                {
                    id: 'res-005',
                    type: 'audio',
                    title: "Dr. Aris Interview Tape",
                    summary: "Audio distortion obscures the patient's name every time it is mentioned.",
                    tags: ['Audio', 'Corrupted']
                }
            ],
            aiContext: "Warning: Biological resonance patterns found in text data."
        },
        {
            id: 'vostok',
            title: 'Vostok Signal',
            description: 'Analysis of the low-frequency radio waves picked up near the Vostok station that mimic biological heartbeats.',
            resources: [
                {
                    id: 'res-006',
                    type: 'data',
                    title: "Signal Log: Nov 12",
                    summary: "Frequency 44Hz. Rhythm consistent with large mammal cardiac activity.",
                    tags: ['Telemetry', 'Antarctica']
                }
            ],
            aiContext: "Signal origin depth calculated: 4000 meters under ice."
        }
    ]
};
