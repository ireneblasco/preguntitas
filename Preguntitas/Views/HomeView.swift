import SwiftUI

struct HomeView: View {
    @Environment(QuestionStore.self) private var questionStore
    @Environment(AppLocaleStore.self) private var localeStore

    @State private var expandedMomentId: String?
    @State private var path = NavigationPath()
    #if DEBUG
    @State private var showDevMenu = false
    @State private var showDevResult = false
    @State private var devResultTitle = ""
    @State private var devResultMessage = ""
    #endif

    var body: some View {
        NavigationStack(path: $path) {
            ZStack {
                LinearGradient.appBackground
                    .ignoresSafeArea()

                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        Text(String(localized: "home.sectionTitle"))
                            .font(.system(size: 22, weight: .bold, design: .serif))
                            .foregroundStyle(AppColors.textPrimary)
                            .padding(.horizontal, 20)

                        ForEach(questionStore.momentOptions) { moment in
                            momentCard(moment)
                        }

                        NavigationLink(value: HomeRoute.favorites) {
                            HStack {
                                Text(String(localized: "home.myFavorites"))
                                    .font(.system(size: 17, weight: .semibold))
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .foregroundStyle(AppColors.textSecondary)
                            }
                            .padding(18)
                            .background(Color.white.opacity(0.85))
                            .clipShape(RoundedRectangle(cornerRadius: 16))
                            .shadow(color: .black.opacity(0.06), radius: 8, y: 4)
                        }
                        .padding(.horizontal, 20)

                        Spacer(minLength: 40)
                    }
                    .padding(.top, 8)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text(String(localized: "home.appName"))
                        .font(.system(size: 20, weight: .bold, design: .serif))
                }
                ToolbarItem(placement: .topBarLeading) {
                    #if DEBUG
                    Button(String(localized: "dev.devMenu")) {
                        showDevMenu = true
                    }
                    .font(.caption.weight(.semibold))
                    #else
                    EmptyView()
                    #endif
                }
                ToolbarItem(placement: .topBarTrailing) {
                    NavigationLink(value: HomeRoute.settings) {
                        Image(systemName: "gearshape")
                            .foregroundStyle(AppColors.textPrimary)
                    }
                }
            }
            .navigationDestination(for: HomeRoute.self) { route in
                switch route {
                case .favorites:
                    FavoritesView()
                case .settings:
                    SettingsView()
                case .questions(let momentId):
                    QuestionsDeckView(momentId: momentId)
                }
            }
            #if DEBUG
            .confirmationDialog(
                String(localized: "dev.menuTitle"),
                isPresented: $showDevMenu,
                titleVisibility: .visible
            ) {
                Button(String(localized: "dev.fetchLatest")) {
                    Task { await runDevFetch() }
                }
                Button(String(localized: "dev.resetOnboarding"), role: .destructive) {
                    AppPersistence.resetOnboarding()
                    NotificationCenter.default.post(name: .devResetOnboarding, object: nil)
                }
                Button(String(localized: "dev.cancel"), role: .cancel) {}
            } message: {
                Text(formatLastFetched(questionStore.lastFetchedAt))
            }
            .alert(devResultTitle, isPresented: $showDevResult) {
                Button(String(localized: "dev.cancel"), role: .cancel) {}
            } message: {
                Text(devResultMessage)
            }
            #endif
        }
        .onAppear {
            if expandedMomentId == nil {
                expandedMomentId = questionStore.momentOptions.first?.id
            }
        }
    }

    #if DEBUG
    private func runDevFetch() async {
        do {
            if try await questionStore.refetchFromNotion() == nil {
                devResultTitle = String(localized: "alerts.notConfigured")
                devResultMessage = String(localized: "alerts.notConfiguredMessage")
            } else {
                devResultTitle = String(localized: "alerts.questionsUpdated")
                devResultMessage = formatLastFetched(questionStore.lastFetchedAt)
            }
        } catch {
            devResultTitle = String(localized: "alerts.error")
            devResultMessage = error.localizedDescription
        }
        showDevResult = true
    }
    #endif

    private func count(for momentId: String) -> Int {
        questionStore.questions.filter { $0.moment.contains(momentId) }.count
    }

    private func momentCard(_ moment: MomentOption) -> some View {
        let idx = questionStore.themeIndex(forMomentId: moment.id)
        let theme = AppColors.theme(forMomentIndex: idx)
        let isExpanded = expandedMomentId == moment.id

        return VStack(alignment: .leading, spacing: 12) {
            Button {
                withAnimation(.spring(response: 0.35, dampingFraction: 0.85)) {
                    expandedMomentId = isExpanded ? nil : moment.id
                }
            } label: {
                HStack {
                    Text(moment.emoji)
                        .font(.title2)
                    VStack(alignment: .leading, spacing: 4) {
                        Text(moment.name)
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundStyle(theme.text)
                        Text(
                            String.localizedStringWithFormat(
                                String(localized: "home.questionCount"),
                                count(for: moment.id)
                            )
                        )
                            .font(.subheadline)
                            .foregroundStyle(theme.text.opacity(0.85))
                    }
                    Spacer()
                    Image(systemName: isExpanded ? "chevron.up" : "chevron.down")
                        .foregroundStyle(theme.text.opacity(0.8))
                }
                .padding(16)
            }

            if isExpanded {
                Button {
                    path.append(HomeRoute.questions(moment.id))
                } label: {
                    HStack {
                        Text(String(localized: "home.start"))
                            .font(.system(size: 17, weight: .semibold))
                        Spacer()
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 14)
                    .background(theme.text.opacity(0.15))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .padding(.horizontal, 12)
                    .padding(.bottom, 12)
                }
            }
        }
        .background(theme.bg)
        .clipShape(RoundedRectangle(cornerRadius: 18))
        .shadow(color: .black.opacity(0.08), radius: 10, y: 5)
        .padding(.horizontal, 20)
    }
}

private enum HomeRoute: Hashable {
    case favorites
    case settings
    case questions(String)
}

private func formatLastFetched(_ iso: String?) -> String {
    guard let iso else {
        return String(localized: "dev.usingBundled")
    }
    let formatter = ISO8601DateFormatter()
    formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
    if let date = formatter.date(from: iso) ?? ISO8601DateFormatter().date(from: iso) {
        let d = DateFormatter.localizedString(from: date, dateStyle: .short, timeStyle: .short)
        return "\(String(localized: "dev.lastUpdatedLabel")): \(d)"
    }
    return "\(String(localized: "dev.lastUpdatedLabel")): \(iso)"
}
