/* eslint-disable react/no-unescaped-entities */

import { BookOpen, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

// 1. Fake Data (Mocking the database)
import recentSessions from "../../lib/sessions";

function MainContent() {
  const hasSessions = recentSessions.length > 0;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>

      {!hasSessions ? (
        /* Empty State */
        <div className="rounded-xl border border-dashed text-card-foreground bg-transparent flex flex-col items-center justify-center p-12 text-center min-h-52">
          <BookOpen className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">No sessions yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">
            You haven't generated any study materials. Click the button above to
            paste your first text.
          </p>
        </div>
      ) : (
        /* Session Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentSessions.map((session) => (
            <Card
              key={session.id}
              className="hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between"
            >
              <CardHeader>
                <CardTitle className="text-lg leading-tight line-clamp-2">
                  {session.title}
                </CardTitle>
              </CardHeader>
              <CardFooter className="text-sm text-muted-foreground flex justify-between border-t pt-4 mt-auto">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {session.date}
                </div>
                <div className="font-medium">{session.cards} Cards</div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
export default MainContent;
