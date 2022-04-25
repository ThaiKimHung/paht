const ModalSlide = ({ current, next, layouts }) => {
    return {
        cardStyle: {
            transform: [
                {
                    translateY: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.height, 0],
                    }),
                },
            ],
        },
        overlayStyle: {
            opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, .5],
            })
        }
    }
};

const ModalFaded = ({ current, next, layouts }) => {
    return {
        cardStyle: {
            opacity: current.progress.interpolate({
                inputRange: [0, .8],
                outputRange: [0, 1],
            })
        },
        overlayStyle: {
            opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, .5],
            })
        }
    }
};

const ModalZoomOut = ({ current, next, layouts }) => {
    return {
        cardStyle: {
            transform: [
                {
                    scale: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [.5, 1],
                    }),
                },
            ]
        },
        overlayStyle: {
            opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [.3, .5],
            })
        }
    }
};

export const modalOption = {
    headerShown: false,
    cardOverlayEnabled: true,
    swipeEnabled: true,
    cardStyle: {backgroundColor: 'transparent'},
    gestureEnabled: true,
    gestureDirection: 'vertical',
    gestureResponseDistance: {
        vertical: 300,
    },
    cardStyleInterpolator: ({ current, layouts }) => ({
        cardStyle: {
            transform: [
                {
                    translateY: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.height, 0],
                    }),
                },
            ],
        },
        overlayStyle: {
            opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, .6],
            })
        }
    }),
};

export const modalOptionHorizontalSlide = {
    headerShown: false,
    cardOverlayEnabled: true,
    swipeEnabled: true,
    cardStyle: {backgroundColor: 'transparent'},
    gestureEnabled: true,
    gestureDirection: 'horizontal',
    gestureResponseDistance: {
        vertical: 100,
    },
    cardStyleInterpolator: ({ current, layouts }) => ({
        cardStyle: {
            transform: [
                {
                    translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                    }),
                },
            ],
        },
        overlayStyle: {
            opacity: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, .3],
            })
        }
    }),
};
