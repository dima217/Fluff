const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#1E1E1E',
        borderRadius: 20,
        overflow: 'hidden',
        marginVertical: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    cardImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    textDetails: {
        flex: 1,
        marginRight: 10,
    },
    title: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    calories: {
        fontSize: 16,
        color: '#B0B0B0',
        marginBottom: 5,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 14,
        color: '#FFFFFF',
        marginRight: 5,
    },
    actionIconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullWidthContainer: {
        width: '100%',
    },
    fullWidthImageWrapper: {
        width: '100%',
        height: 180,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    carouselContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        width: 330,
        marginRight: 15,
    },
    carouselImageWrapper: {
        width: 70, 
        height: 70,
        borderRadius: 10,
        overflow: 'hidden',
    },
    carouselContentContainer: {
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    carouselTitle: {
        fontSize: 18,
        fontWeight: '500', 
    },
    carouselCalories: {
        fontSize: 14,
    },
});