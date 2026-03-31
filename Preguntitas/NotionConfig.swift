import Foundation

/// Reads Notion credentials from scheme environment (DEBUG) or Info.plist (`Secrets.xcconfig`).
enum NotionConfig {
    static var apiKey: String? {
        let env = ProcessInfo.processInfo.environment["NOTION_API_KEY"] ?? ""
        if !env.isEmpty { return env }
        return Bundle.main.object(forInfoDictionaryKey: "NOTION_API_KEY") as? String
    }

    static var databaseId: String? {
        let env = ProcessInfo.processInfo.environment["NOTION_DATABASE_ID"] ?? ""
        if !env.isEmpty { return env }
        return Bundle.main.object(forInfoDictionaryKey: "NOTION_DATABASE_ID") as? String
    }

    static var isConfigured: Bool {
        guard let k = apiKey, !k.isEmpty, let d = databaseId, !d.isEmpty else { return false }
        return true
    }
}
