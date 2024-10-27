import { StyleSheet, Text, View, ScrollView, Linking, Platform } from 'react-native';

export default function About() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Om denne app</Text>
        <Text style={styles.description}>
          Velkommen til Listify!
        </Text>
        <Text style={styles.description}>
          Denne applikation giver dig mulighed for nemt at administrere dine opgaver.
        </Text>
        <Text style={styles.description}>
          Du kan tilføje opgaver med en titel og beskrivelse, se dine opgaver i en liste, og trykke på en opgave for at se dens detaljer.
        </Text>
        {Platform.OS === 'web' ? (
          <>
            <Text style={styles.description}>
              Brug slet-knappen efter at have klikket på en opgave for at fjerne opgaven, hvis den ikke længere er nødvendig.
            </Text>
            <Text style={styles.description}>
              Alle opgaver gemmes lokalt, så du ikke mister dem, selvom du lukker appen.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.description}>
              Foretag et langt tryk på en opgave for at slette den, hvis den ikke længere er nødvendig.
            </Text>
            <Text style={styles.description}>
              Alle opgaver gemmes lokalt, så du ikke mister dem, selvom du lukker appen.
            </Text>
          </>
        )}
        {Platform.OS !== 'web' && (
          <>
            <Text style={styles.contact}>Kontakt: mvmads@gmail.com</Text>
            <Text style={styles.contact}>
              GitHub: 
              <Text style={styles.link} onPress={() => Linking.openURL('https://github.com/Ditz3n')}>
                https://github.com/Ditz3n
              </Text>
            </Text>
            <Text style={styles.copyright}>© 2024 Mads Dittmann Villadsen</Text>
          </>
        )}
      </ScrollView>
      {Platform.OS === 'web' && (
        <View style={styles.webContactContainer}>
          <Text style={styles.contact}>Kontakt: mvmads@gmail.com</Text>
          <Text style={styles.contact}>
            GitHub: 
            <Text style={styles.link} onPress={() => Linking.openURL('https://github.com/Ditz3n')}>
              https://github.com/Ditz3n
            </Text>
          </Text>
          <Text style={styles.copyright}>© 2024 Mads Dittmann Villadsen</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFAE0', padding: 20 },
  scrollContainer: { paddingBottom: 30 },
  title: { fontSize: 28, color: '#BC6C25', marginBottom: 10 },
  description: { fontSize: 16, color: '#283618', marginBottom: 10 },
  contact: { fontSize: 14, color: '#283618', marginTop: 5, textAlign: 'center' },
  link: { color: '#BC6C25', textDecorationLine: 'underline' },
  webContactContainer: { marginTop: 20, alignItems: 'center' },
  copyright: { fontSize: 14, color: '#BC6C25', marginTop: 20, textAlign: 'center' },
});
