export default {
    DEFAULT: {
        fireRate: 5,
        speed: 500,
        texture: 'bullet',
        bullets: [
            {
                direction: 0,
            }
        ],
    },
    DOUBLE_SHOT: {
        fireRate: 5,
        speed: 500,
        texture: 'bullet',
        bullets: [
            {
                direction: 0,
                offset: {
                    x: -7
                }
            },
            {
                direction: 0,
                offset: {
                    x: 7
                }
            }
        ]
    },
    TRIPLE_SHOT: {
        fireRate: 5,
        speed: 500,
        texture: 'bullet',
        bullets: [
            {
                direction: 0,
            },
            {
                direction: -Math.PI / 16,
                offset: {
                    x: -3,
                }
            },
            {
                direction: Math.PI / 16,
                offset: {
                    x: 3
                }
            },
        ],
    },
    QUAD_SHOT: {
        fireRate: 5,
        speed: 500,
        texture: 'bullet',
        bullets: [
            {
                direction: 0,
                offset: {
                    x: -5
                }
            },
            {
                direction: 0,
                offset: {
                    x: 5
                }
            },
            {
                direction: -Math.PI / 16,
                offset: {
                    x: -10,
                    y: 10
                }
            },
            {
                direction: Math.PI / 16,
                offset: {
                    x: 10,
                    y: 10
                }
            },
        ],
    },
    PENTA_SHOT: {
        fireRate: 5,
        speed: 500,
        texture: 'bullet',
        bullets: [
            {
                direction: 0
            },
            {
                offset: {
                    x: -10
                }
            },
            {
                direction: 0,
                offset: {
                    x: 10
                }
            },
            {
                offset: {
                    x: -20,
                }
            },
            {
                offset: {
                    x: 20,
                }
            },
        ],
    },
    FANCY_WHIRL: {
        fireRate: 5,
        speed: 500,
        texture: 'circle-bullet',
        bullets: [
            {
                direction: 0,
            },
            {
                direction: -Math.PI / 12,
                function: {
                    x: (t) => { return 10 * Math.cos(t); },
                    y: (t) => { return 10 * Math.sin(t); }
                },
            },
            {
                direction: Math.PI / 12,
                function: {
                    x: (t) => { return 10 * Math.cos(t); },
                    y: (t) => { return 10 * Math.sin(t); }
                },
            },
            {
                direction: -Math.PI / 30,
                function: {
                    x: (t) => { return 10 * Math.cos(t); },
                    y: (t) => { return 10 * Math.cos(t); }
                },
            },
            {
                direction: Math.PI / 30,
                function: {
                    x: (t) => { return 10 * Math.cos(t); },
                    y: (t) => { return 10 * Math.cos(t); }
                },
            },
            {
                direction: -Math.PI / 20,
                function: {
                    x: (t) => { return 10 * Math.sin(t); },
                    y: (t) => { return 10 * Math.sin(t); }
                },
            },
            {
                direction: Math.PI / 20,
                function: {
                    x: (t) => { return 10 * Math.sin(t); },
                    y: (t) => { return 10 * Math.sin(t); }
                },
            }  
        ],
    },
};
