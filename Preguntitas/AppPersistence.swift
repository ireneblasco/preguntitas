import Foundation

/// UserDefaults keys aligned with the Expo app (`AsyncStorage`).
enum AppPersistence {
    private static let onboardingKey = "hasSeenOnboarding"
    private static let favoritesKey = "favorites"
    private static let questionsCacheKey = "questions_cache"
    private static let appLanguageKey = "app_language"

    private static var defaults: UserDefaults { .standard }

    // MARK: - Onboarding

    static func hasSeenOnboarding() -> Bool {
        defaults.string(forKey: onboardingKey) == "true"
    }

    static func markOnboardingSeen() {
        defaults.set("true", forKey: onboardingKey)
    }

    static func resetOnboarding() {
        defaults.removeObject(forKey: onboardingKey)
    }

    // MARK: - Favorites

    static func getFavorites() -> [String] {
        guard let raw = defaults.string(forKey: favoritesKey),
              let data = raw.data(using: .utf8),
              let arr = try? JSONDecoder().decode([String].self, from: data)
        else { return [] }
        return arr
    }

    static func setFavorites(_ ids: [String]) {
        guard let data = try? JSONEncoder().encode(ids),
              let str = String(data: data, encoding: .utf8)
        else { return }
        defaults.set(str, forKey: favoritesKey)
    }

    static func toggleFavorite(id: String) -> Bool {
        var list = getFavorites()
        if let idx = list.firstIndex(of: id) {
            list.remove(at: idx)
            setFavorites(list)
            return false
        }
        list.append(id)
        setFavorites(list)
        return true
    }

    static func isFavorite(id: String) -> Bool {
        getFavorites().contains(id)
    }

    static func removeFavorite(id: String) {
        setFavorites(getFavorites().filter { $0 != id })
    }

    // MARK: - Questions cache

    static func loadQuestionsCache() -> CachedQuestionsPayload? {
        guard let raw = defaults.string(forKey: questionsCacheKey),
              let data = raw.data(using: .utf8),
              let payload = try? JSONDecoder().decode(CachedQuestionsPayload.self, from: data),
              !payload.questions.isEmpty,
              !payload.momentOptions.isEmpty
        else { return nil }
        return payload
    }

    static func saveQuestionsCache(questions: [Question], momentOptions: [MomentOption], fetchedAt: String) {
        let payload = CachedQuestionsPayload(
            questions: questions,
            momentOptions: momentOptions,
            fetchedAt: fetchedAt
        )
        if let data = try? JSONEncoder().encode(payload),
           let str = String(data: data, encoding: .utf8)
        {
            defaults.set(str, forKey: questionsCacheKey)
        }
    }

    // MARK: - Locale

    static func getStoredLocaleTag() -> String? {
        defaults.string(forKey: appLanguageKey)
    }

    static func setStoredLocaleTag(_ tag: String) {
        defaults.set(tag, forKey: appLanguageKey)
    }
}
