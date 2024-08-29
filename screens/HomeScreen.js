import React, { useCallback, useEffect, useState } from "react";
import { Text, View, SafeAreaView, TextInput, Image, TouchableOpacity, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { theme } from "../theme";
import { CalendarDaysIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { MapPinIcon } from 'react-native-heroicons/solid';
import { debounce } from 'lodash';
import { fetchLocations, fetchWeatherForecast } from "../api/weather";
import { weatherImages } from "../constants";
import * as Progress from 'react-native-progress'; // Corrected import

export default function HomeScreen() {
    const [showSearch, toggleSearch] = useState(false);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [weather, setWeather] = useState({});
    const [loading, setLoading] = useState(true);

    // Fetch initial weather data for Ankara
    useEffect(() => {
        fetchMyWeatherData();
    }, []);

    const fetchMyWeatherData = async () => {
        try {
            const data = await fetchWeatherForecast({
                cityName: 'Ankara',
                days: '7'
            });
            setWeather(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching initial weather data:', error);
        }
    };

    const handleLocation = (loc) => {
        setSelectedLocation(loc);
        setLocations([]);
        toggleSearch(false);
        setLoading(true);
        fetchWeatherForecast({
            cityName: loc.name,
            days: '7',
        }).then(data => {
            setWeather(data);
            setLoading(false);
        }).catch(error => {
            console.error('Error fetching weather data:', error);
        });
    };

    const handleSearch = async (value) => {
        if (value.length > 2) {
            try {
                const data = await fetchLocations({ cityName: value });
                setLocations(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
                setLocations([]);
            }
        }
    };

    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
    const current = weather?.current || {};

    return (
        <View style={{ flex: 1, position: 'relative' }}>
            <StatusBar style="light" />
            <Image
                blurRadius={70}
                source={require('../assets/images/mc.jpg')}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                resizeMode='cover'
            />
            {
                loading ? (
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Progress.CircleSnail thickness={10} size={120} color="#017f7f" />
                    </View>
                ) : (
                    <SafeAreaView style={{ flex: 1 }}>
                        {/* Search Section */}
                        <View style={{ height: '8%', marginHorizontal: 20, marginTop: StatusBar.currentHeight || 50, position: 'relative', zIndex: 50 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 50, backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent', paddingHorizontal: 0, paddingVertical: 1 }}>
                                {showSearch ? (
                                    <TextInput
                                        onChangeText={handleTextDebounce}
                                        placeholder='Search City'
                                        placeholderTextColor='lightgray'
                                        style={{
                                            paddingLeft: 10,
                                            paddingBottom: 4,
                                            flex: 1,
                                            fontSize: 16,
                                            color: 'white'
                                        }}
                                    />
                                ) : null}
                                <TouchableOpacity
                                    onPress={() => toggleSearch(!showSearch)}
                                    style={{
                                        backgroundColor: theme.bgWhite(0.3),
                                        borderRadius: 50,
                                        padding: 2,
                                    }}
                                >
                                    <MagnifyingGlassIcon size={25} color="white" />
                                </TouchableOpacity>
                            </View>
                            {
                                locations.length > 0 && showSearch ? (
                                    <View style={{
                                        position: 'absolute',
                                        width: '100%',
                                        backgroundColor: '#D1D5DB',
                                        top: 64,
                                        borderRadius: 24,
                                        padding: 16,
                                    }}>
                                        {
                                            locations.map((loc, index) => (
                                                <TouchableOpacity
                                                    onPress={() => handleLocation(loc)}
                                                    key={index}
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        borderBottomWidth: index + 1 !== locations.length ? 1 : 0,
                                                        borderBottomColor: '#9CA3AF',
                                                        padding: 3,
                                                        paddingHorizontal: 8,
                                                    }}
                                                >
                                                    <MapPinIcon size={20} color="gray" />
                                                    <Text style={{ color: 'black', fontSize: 14, marginLeft: 4 }}>
                                                        {loc?.name}, {loc?.country}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))
                                        }
                                    </View>
                                ) : null
                            }
                        </View>
                        <View style={{
                            flexDirection: 'column',
                            marginHorizontal: 16,
                            justifyContent: 'center',
                        }}>
                            <Text style={{
                                color: 'white',
                                textAlign: 'center',
                                fontSize: 24,
                                fontWeight: 'bold'
                            }}>
                                {selectedLocation?.name || 'Ankara'},
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: '600',
                                    color: '#D1D5DB'
                                }}>
                                    {" "}{selectedLocation?.country || 'Turkey'}
                                </Text>
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center'
                            }}>
                                <Image
                                    source={weatherImages[current?.condition?.text]}
                                    style={{
                                        width: 120,
                                        height: 120
                                    }}
                                />
                            </View>
                            <View style={{ marginBottom: 180 }}>
                                <Text style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    fontSize: 55,
                                    marginLeft: 1
                                }}>
                                    {current?.temp_c}&#176;
                                </Text>
                                <Text style={{
                                    textAlign: 'center',
                                    color: '#D1D5DB',
                                    fontSize: 20,
                                    letterSpacing: 0.1
                                }}>
                                    {current?.condition?.text}
                                </Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginHorizontal: 16,
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <Image
                                        source={require('../assets/images/wind.png')}
                                        style={{
                                            height: 24,
                                            width: 24,
                                        }}
                                    />
                                    <Text style={{
                                        color: 'white',
                                        fontWeight: '600',
                                        fontSize: 16,
                                    }}>
                                        {current?.wind_kph}km
                                    </Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <Image
                                        source={require('../assets/images/drop.png')}
                                        style={{
                                            height: 20,
                                            width: 20,
                                        }}
                                    />
                                    <Text style={{
                                        color: 'white',
                                        fontWeight: '600',
                                        fontSize: 16,
                                    }}>
                                        {current?.humidity}%
                                    </Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <Image
                                        source={require('../assets/images/sun.png')}
                                        style={{
                                            height: 24,
                                            width: 24,
                                        }}
                                    />
                                    <Text style={{
                                        color: 'white',
                                        fontWeight: '600',
                                        fontSize: 16,
                                    }}>
                                        6:00 AM
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{
                            marginTop: 18,
                            marginBottom: 18,
                            marginVertical: 22
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginHorizontal: 32,
                            }}>
                                <CalendarDaysIcon size="22" color="white" />
                                <Text style={{
                                    color: 'white',
                                    fontSize: 16,
                                }}>
                                    Daily Forecast
                                </Text>
                            </View>
                            <ScrollView
                                horizontal
                                contentContainerStyle={{ paddingHorizontal: 15 }}
                                showsHorizontalScrollIndicator={false}
                            >
                                {
                                    weather?.forecast?.forecastday?.map((item, index) => {
                                        let date = new Date(item.date);
                                        let options = { weekday: 'long' };
                                        let dayName = date.toLocaleDateString('en-US', options);
                                        dayName = dayName.split(',')[0];
                                        return (
                                            <View
                                                key={index}
                                                style={{
                                                    flexDirection: 'column',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    width: 96,
                                                    borderRadius: 24,
                                                    paddingVertical: 10,
                                                    marginRight: 16,
                                                    marginTop: 13,
                                                    backgroundColor: theme.bgWhite(0.15)
                                                }}
                                            >
                                                <Image source={weatherImages[item?.day?.condition?.text]}
                                                    style={{ height: 50, width: 50, }} />
                                                <Text style={{ color: 'white', }}>{item.date}</Text>
                                                <Text style={{ color: 'white', fontWeight: '600' }}>{item?.day?.avgtemp_c}&#176;</Text>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    </SafeAreaView>
                )
            }
        </View>
    );
}
