import Foundation

struct Question: Codable, Identifiable, Hashable {
    let id: String
    let textEn: String
    let textEs: String
    let moment: [String]
}

struct MomentOption: Codable, Identifiable, Hashable {
    var id: String
    let name: String
    var emoji: String
}

/// Bundled `questions.json` shape (no `fetchedAt`).
struct QuestionsBundle: Codable {
    let questions: [Question]
    let momentOptions: [MomentOption]
}

/// AsyncStorage `questions_cache` payload (matches React Native).
struct CachedQuestionsPayload: Codable {
    let questions: [Question]
    let momentOptions: [MomentOption]
    let fetchedAt: String
}
