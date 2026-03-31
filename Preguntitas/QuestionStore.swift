import Foundation
import Observation

@Observable
@MainActor
final class QuestionStore {
    private(set) var questions: [Question] = []
    private(set) var momentOptions: [MomentOption] = []
    private(set) var lastFetchedAt: String?
    private(set) var isLoading: Bool = false
    private(set) var refetchError: String?

    init() {
        loadBundledFallback()
        Task { await bootstrap() }
    }

    private func bootstrap() async {
        await loadCacheIfPresent()
        await refreshFromNotionIfConfigured()
    }

    /// Matches RN `momentOptionsDisplay` (Road Trip emoji → globe).
    static func applyRoadTripEmoji(_ options: [MomentOption]) -> [MomentOption] {
        options.map { m in
            var copy = m
            if m.id.contains("Road Trip") || m.name == "Road Trip" {
                copy.emoji = "🌎"
            }
            return copy
        }
    }

    func loadBundledFallback() {
        guard let url = Bundle.main.url(forResource: "questions", withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let bundle = try? JSONDecoder().decode(QuestionsBundle.self, from: data)
        else { return }
        questions = bundle.questions
        momentOptions = Self.applyRoadTripEmoji(bundle.momentOptions)
        lastFetchedAt = nil
        refetchError = nil
    }

    @MainActor
    private func loadCacheIfPresent() async {
        guard let cached = AppPersistence.loadQuestionsCache() else { return }
        questions = cached.questions
        momentOptions = Self.applyRoadTripEmoji(cached.momentOptions)
        lastFetchedAt = cached.fetchedAt
    }

    @MainActor
    private func refreshFromNotionIfConfigured() async {
        guard NotionConfig.isConfigured,
              let key = NotionConfig.apiKey,
              let db = NotionConfig.databaseId
        else { return }

        do {
            let result = try await NotionClient.fetchQuestions(apiKey: key, databaseId: db)
            let fetchedAt = ISO8601DateFormatter().string(from: Date())
            let displayOptions = Self.applyRoadTripEmoji(result.momentOptions)
            AppPersistence.saveQuestionsCache(
                questions: result.questions,
                momentOptions: displayOptions,
                fetchedAt: fetchedAt
            )
            questions = result.questions
            momentOptions = displayOptions
            lastFetchedAt = fetchedAt
            refetchError = nil
        } catch {
            refetchError = (error as NSError).localizedDescription
        }
    }

    /// Manual refetch (dev menu). Returns ISO timestamp on success, `nil` if not configured.
    func refetchFromNotion() async throws -> String? {
        guard NotionConfig.isConfigured,
              let key = NotionConfig.apiKey,
              let db = NotionConfig.databaseId
        else {
            refetchError = String(localized: "alerts.notConfiguredMessage")
            return nil
        }
        isLoading = true
        refetchError = nil
        defer { isLoading = false }
        let result = try await NotionClient.fetchQuestions(apiKey: key, databaseId: db)
        let fetchedAt = ISO8601DateFormatter().string(from: Date())
        let displayOptions = Self.applyRoadTripEmoji(result.momentOptions)
        AppPersistence.saveQuestionsCache(questions: result.questions, momentOptions: displayOptions, fetchedAt: fetchedAt)
        questions = result.questions
        momentOptions = displayOptions
        lastFetchedAt = fetchedAt
        return fetchedAt
    }

    func themeIndex(forMomentId id: String) -> Int {
        momentOptions.firstIndex(where: { $0.id == id }) ?? 0
    }
}

@Observable
@MainActor
final class FavoritesStore {
    private(set) var ids: [String]

    init() {
        ids = AppPersistence.getFavorites()
    }

    func contains(_ id: String) -> Bool {
        ids.contains(id)
    }

    @discardableResult
    func toggle(_ id: String) -> Bool {
        let added = AppPersistence.toggleFavorite(id: id)
        ids = AppPersistence.getFavorites()
        return added
    }

    func remove(_ id: String) {
        AppPersistence.removeFavorite(id: id)
        ids = AppPersistence.getFavorites()
    }
}

@Observable
@MainActor
final class AppLocaleStore {
    var locale: AppLocale {
        didSet {
            AppPersistence.setStoredLocaleTag(locale.rawValue)
        }
    }

    init() {
        locale = AppLocale.initialStoredOrDevice()
        if AppPersistence.getStoredLocaleTag() == nil {
            AppPersistence.setStoredLocaleTag(locale.rawValue)
        }
    }
}
