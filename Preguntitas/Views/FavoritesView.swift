import SwiftUI

struct FavoritesView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(QuestionStore.self) private var questionStore
    @Environment(FavoritesStore.self) private var favoritesStore
    @Environment(AppLocaleStore.self) private var localeStore

    private var favoriteQuestions: [Question] {
        favoritesStore.ids.compactMap { id in questionStore.questions.first(where: { $0.id == id }) }
    }

    var body: some View {
        ZStack {
            LinearGradient.appBackground
                .ignoresSafeArea()

            VStack(spacing: 0) {
                HStack {
                    Button {
                        dismiss()
                    } label: {
                        Image(systemName: "chevron.left")
                            .font(.title3.weight(.semibold))
                            .foregroundStyle(AppColors.textPrimary)
                    }
                    Spacer()
                    Text(String(localized: "favorites.title"))
                        .font(.system(size: 18, weight: .bold, design: .serif))
                    Spacer()
                    Color.clear.frame(width: 24, height: 24)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)

                Text(String(localized: "favorites.savedQuestions"))
                    .font(.subheadline)
                    .foregroundStyle(AppColors.textSecondary)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(.horizontal, 20)
                    .padding(.bottom, 8)

                if favoriteQuestions.isEmpty {
                    Spacer()
                    Text(String(localized: "favorites.emptyHint"))
                        .font(.body)
                        .foregroundStyle(AppColors.textSecondary)
                        .multilineTextAlignment(.center)
                        .padding(32)
                    Spacer()
                } else {
                    List {
                        ForEach(favoriteQuestions) { item in
                            let momentId = item.moment.first ?? ""
                            let idx = questionStore.themeIndex(forMomentId: momentId)
                            let theme = AppColors.theme(forMomentIndex: idx)
                            let pill = questionStore.momentOptions.first(where: { $0.id == momentId })?.name ?? momentId

                            VStack(alignment: .leading, spacing: 10) {
                                Text(pill)
                                    .font(.caption.weight(.semibold))
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 4)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 8)
                                            .stroke(theme.text, lineWidth: 1)
                                    )
                                    .foregroundStyle(theme.text)
                                Text(questionDisplayText(item, locale: localeStore.locale))
                                    .font(.system(size: 17, weight: .medium, design: .serif))
                                    .foregroundStyle(theme.text)
                                    .lineLimit(3)
                            }
                            .listRowInsets(EdgeInsets(top: 10, leading: 16, bottom: 10, trailing: 16))
                            .listRowSeparator(.hidden)
                            .listRowBackground(theme.bg)
                            .swipeActions(edge: .trailing, allowsFullSwipe: true) {
                                Button(role: .destructive) {
                                    favoritesStore.remove(item.id)
                                } label: {
                                    Text(String(localized: "favorites.remove"))
                                }
                            }
                        }
                    }
                    .listStyle(.plain)
                    .scrollContentBackground(.hidden)
                }
            }
        }
        .navigationBarBackButtonHidden(true)
    }
}
