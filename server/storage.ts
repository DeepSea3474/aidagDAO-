import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import {
  subscribers,
  messages,
  exchangeListings,
  autonomousOps,
  founderBriefings,
  founderDirectives,
  type InsertSubscriber,
  type InsertMessage,
  type InsertExchangeListing,
  type InsertAutonomousOp,
  type InsertFounderBriefing,
  type InsertFounderDirective,
  type Subscriber,
  type Message,
  type ExchangeListing,
  type AutonomousOp,
  type FounderBriefing,
  type FounderDirective
} from "@shared/schema";

export interface IStorage {
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  createMessage(message: InsertMessage): Promise<Message>;
  getExchangeListings(): Promise<ExchangeListing[]>;
  createExchangeListing(listing: InsertExchangeListing): Promise<ExchangeListing>;
  updateExchangeListingStatus(id: number, status: string, note?: string): Promise<ExchangeListing>;
  getAutonomousOps(limit?: number): Promise<AutonomousOp[]>;
  createAutonomousOp(op: InsertAutonomousOp): Promise<AutonomousOp>;
  getFounderBriefings(): Promise<FounderBriefing[]>;
  createFounderBriefing(briefing: InsertFounderBriefing): Promise<FounderBriefing>;
  updateFounderBriefing(id: number, updates: Partial<FounderBriefing>): Promise<FounderBriefing>;
  getFounderDirectives(): Promise<FounderDirective[]>;
  createFounderDirective(directive: InsertFounderDirective): Promise<FounderDirective>;
  updateFounderDirective(id: number, updates: Partial<FounderDirective>): Promise<FounderDirective>;
}

export class DatabaseStorage implements IStorage {
  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const [subscriber] = await db
      .insert(subscribers)
      .values(insertSubscriber)
      .returning();
    return subscriber;
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async getExchangeListings(): Promise<ExchangeListing[]> {
    return db.select().from(exchangeListings);
  }

  async createExchangeListing(listing: InsertExchangeListing): Promise<ExchangeListing> {
    const [result] = await db
      .insert(exchangeListings)
      .values(listing)
      .returning();
    return result;
  }

  async updateExchangeListingStatus(id: number, status: string, note?: string): Promise<ExchangeListing> {
    const [result] = await db
      .update(exchangeListings)
      .set({
        status,
        responseNote: note || null,
        ...(status === "submitted" ? { submittedAt: new Date() } : {}),
        ...(status === "approved" || status === "rejected" ? { respondedAt: new Date() } : {}),
      })
      .where(eq(exchangeListings.id, id))
      .returning();
    return result;
  }

  async getAutonomousOps(limit = 50): Promise<AutonomousOp[]> {
    return db.select().from(autonomousOps).orderBy(desc(autonomousOps.createdAt)).limit(limit);
  }

  async createAutonomousOp(op: InsertAutonomousOp): Promise<AutonomousOp> {
    const [result] = await db
      .insert(autonomousOps)
      .values(op)
      .returning();
    return result;
  }

  async getFounderBriefings(): Promise<FounderBriefing[]> {
    return db.select().from(founderBriefings).orderBy(desc(founderBriefings.createdAt));
  }

  async createFounderBriefing(briefing: InsertFounderBriefing): Promise<FounderBriefing> {
    const [result] = await db
      .insert(founderBriefings)
      .values(briefing)
      .returning();
    return result;
  }

  async updateFounderBriefing(id: number, updates: Partial<FounderBriefing>): Promise<FounderBriefing> {
    const [result] = await db
      .update(founderBriefings)
      .set(updates)
      .where(eq(founderBriefings.id, id))
      .returning();
    return result;
  }

  async getFounderDirectives(): Promise<FounderDirective[]> {
    return db.select().from(founderDirectives).orderBy(desc(founderDirectives.createdAt));
  }

  async createFounderDirective(directive: InsertFounderDirective): Promise<FounderDirective> {
    const [result] = await db
      .insert(founderDirectives)
      .values(directive)
      .returning();
    return result;
  }

  async updateFounderDirective(id: number, updates: Partial<FounderDirective>): Promise<FounderDirective> {
    const [result] = await db
      .update(founderDirectives)
      .set(updates)
      .where(eq(founderDirectives.id, id))
      .returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
