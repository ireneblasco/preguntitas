import SwiftUI

@main
struct PreguntitasApp: App {
    @State private var questionStore = QuestionStore()
    @State private var favoritesStore = FavoritesStore()
    @State private var localeStore = AppLocaleStore()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(questionStore)
                .environment(favoritesStore)
                .environment(localeStore)
                .environment(\.locale, Locale(identifier: localeStore.locale.rawValue))
        }
    }
}
